import os
import uuid
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRSubmissionDB
from models.dpr_models import DPRDataPayload
from services.calculation_service import CalculationService
from services.balance_sheet_parser import BalanceSheetParser
from services.pdf_service import PDFService

router = APIRouter(prefix="/api/dpr", tags=["DPR Calculations & Reports"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
os.makedirs(UPLOAD_DIR, exist_ok=True)

from typing import Optional
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from config import settings
from models.database_models import UserDB, DPRSubmissionDB

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_optional_user(token: Optional[str] = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)) -> Optional[UserDB]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id:
            return db.query(UserDB).filter(UserDB.id == user_id).first()
    except Exception:
        pass
    return None

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "FastAPI DPR Engine", "version": "2.0.0"}

@router.post("/calculate")
async def calculate_dpr_projections(payload: DPRDataPayload):
    data_dict = payload.model_dump()
    calculated = CalculationService.calculate_all(data_dict)
    return {"success": True, "data": calculated}

@router.post("/save")
async def save_dpr_submission(
    payload: DPRDataPayload,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_optional_user)
):
    data_dict = payload.model_dump()
    b_name = payload.business_name or "Untitled Business"
    d_type = payload.dpr_type or "Bank Loan DPR"
    user_id = current_user.id if current_user else None
    
    submission = None
    if user_id:
        submission = db.query(DPRSubmissionDB).filter(DPRSubmissionDB.user_id == user_id).order_by(DPRSubmissionDB.updated_at.desc()).first()

    if submission:
        submission.business_name = b_name
        submission.dpr_type = d_type
        submission.full_form_json = data_dict
    else:
        submission = DPRSubmissionDB(
            user_id=user_id,
            dpr_type=d_type,
            business_name=b_name,
            full_form_json=data_dict
        )
        db.add(submission)

    db.commit()
    db.refresh(submission)
    
    return {
        "success": True,
        "message": "DPR Form data successfully saved to database.",
        "id": submission.id,
        "user_id": user_id,
        "created_at": submission.created_at,
        "updated_at": submission.updated_at
    }

@router.get("/latest-draft")
async def get_latest_draft(
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_optional_user)
):
    if not current_user:
        return {"has_draft": False, "data": None}

    submission = db.query(DPRSubmissionDB).filter(DPRSubmissionDB.user_id == current_user.id).order_by(DPRSubmissionDB.updated_at.desc()).first()
    if not submission:
        return {"has_draft": False, "data": None}

    return {
        "has_draft": True,
        "id": submission.id,
        "business_name": submission.business_name,
        "dpr_type": submission.dpr_type,
        "updated_at": submission.updated_at,
        "data": submission.full_form_json
    }

@router.get("/my-dprs")
async def list_my_dprs(
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_optional_user)
):
    query = db.query(DPRSubmissionDB)
    if current_user:
        query = query.filter(DPRSubmissionDB.user_id == current_user.id)
    submissions = query.order_by(DPRSubmissionDB.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "business_name": s.business_name,
            "dpr_type": s.dpr_type,
            "created_at": s.created_at,
            "updated_at": s.updated_at,
            "data": s.full_form_json
        } for s in submissions
    ]

@router.post("/upload-balance-sheet")
async def upload_balance_sheet(file: UploadFile = File(...)):
    if not file.filename.endswith((".xlsx", ".xls", ".pdf", ".csv")):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload Excel, CSV or PDF.")
    
    file_bytes = await file.read()
    parsed_data = BalanceSheetParser.parse_excel_or_csv(file_bytes, file.filename)
    return {
        "success": True,
        "message": f"Successfully parsed balance sheet: {file.filename}",
        "extracted_data": parsed_data
    }

@router.post("/upload-image")
async def upload_dpr_image(image: UploadFile = File(...)):
    ext = os.path.splitext(image.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".gif"]:
        raise HTTPException(status_code=400, detail="Invalid image type.")
    
    filename = f"img_{uuid.uuid4().hex[:10]}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as f:
        f.write(await image.read())
        
    return {
        "success": True,
        "filename": filename,
        "url": f"/uploads/{filename}"
    }

@router.post("/generate-pdf")
async def generate_pdf_report(payload: DPRDataPayload, db: Session = Depends(get_db)):
    data_dict = payload.model_dump()
    calculated_data = CalculationService.calculate_all(data_dict)
    
    # Save submission record in database
    b_name = payload.business_name or "Untitled Business"
    d_type = payload.dpr_type or "Bank Loan DPR"
    try:
        submission = DPRSubmissionDB(
            dpr_type=d_type,
            business_name=b_name,
            full_form_json=calculated_data
        )
        db.add(submission)
        db.commit()
    except Exception as e:
        print(f"Error saving DPR to DB: {e}")

    # Generate PDF File
    pdf_filename = f"DPR_{uuid.uuid4().hex[:8]}.pdf"
    output_pdf_path = os.path.join(UPLOAD_DIR, pdf_filename)
    
    generated_path = await PDFService.generate_pdf(calculated_data, TEMPLATES_DIR, output_pdf_path)
    
    if not os.path.exists(generated_path):
        raise HTTPException(status_code=500, detail="DPR Report generation failed.")
        
    media_type = "application/pdf" if generated_path.endswith(".pdf") else "text/html"
    return FileResponse(
        generated_path,
        media_type=media_type,
        filename=f"{payload.business_name or 'DPR'}_Report" + (".pdf" if generated_path.endswith(".pdf") else ".html")
    )
