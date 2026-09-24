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

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "FastAPI DPR Engine", "version": "2.0.0"}

@router.post("/calculate")
async def calculate_dpr_projections(payload: DPRDataPayload):
    data_dict = payload.model_dump()
    calculated = CalculationService.calculate_all(data_dict)
    return {"success": True, "data": calculated}

@router.post("/save")
async def save_dpr_submission(payload: DPRDataPayload, db: Session = Depends(get_db)):
    data_dict = payload.model_dump()
    b_name = payload.business_name or "Untitled Business"
    d_type = payload.dpr_type or "Bank Loan DPR"
    
    submission = DPRSubmissionDB(
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
        "created_at": submission.created_at
    }

@router.get("/my-dprs")
async def list_my_dprs(db: Session = Depends(get_db)):
    submissions = db.query(DPRSubmissionDB).order_by(DPRSubmissionDB.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "business_name": s.business_name,
            "dpr_type": s.dpr_type,
            "created_at": s.created_at,
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
