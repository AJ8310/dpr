from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRProjectDB, DPRResponseDB, DPRQuestionDB, UserDB
from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver
from dpr_engine.questions.question_engine import DynamicQuestionEngine
from routers.auth_router import get_current_user_obj

router = APIRouter(prefix="/api", tags=["Dynamic DPR Question Engine"])

# Request Schemas
class SingleResponseRequest(BaseModel):
    value: Any
    source: Optional[str] = "USER_PROVIDED"
    question_version: Optional[str] = "1.0.0"

class BatchResponsesRequest(BaseModel):
    responses: Dict[str, Any]  # Map of question_key -> value
    source: Optional[str] = "USER_PROVIDED"

@router.get("/questions")
async def get_questions_schema(blueprint_id: Optional[str] = None, db: Session = Depends(get_db)):
    if blueprint_id:
        qs = db.query(DPRQuestionDB).filter(
            DPRQuestionDB.blueprint_id == blueprint_id,
            DPRQuestionDB.is_active == True
        ).all()
        return {"success": True, "blueprint_id": blueprint_id, "data": [q.__dict__ for q in qs]}

    # Return default bank blueprint questions
    bp = DynamicBlueprintResolver.resolve_blueprint("Bank Loan DPR", db=db)
    return {"success": True, "data": bp.get("questions", [])}

@router.get("/questions/{question_id}")
async def get_question_detail(question_id: str, db: Session = Depends(get_db)):
    q = db.query(DPRQuestionDB).filter(DPRQuestionDB.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question ID not found.")
    return {"success": True, "data": {
        "id": q.id, "key": q.key, "label": q.label, "field_type": q.field_type,
        "data_type": q.data_type, "required": q.required, "options": q.options_json
    }}

@router.get("/projects/{project_id}/responses")
async def get_project_responses(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    if current_user and project.user_id and project.user_id != current_user.id and current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to project responses.")

    # Fetch recorded database responses
    db_responses = db.query(DPRResponseDB).filter(DPRResponseDB.project_id == project_id).all()
    resp_dict = {r.question_key: r.value_json for r in db_responses}

    # Merge project level base info (business_name, dpr_type, etc.)
    if project.form_data_json:
        for k, v in project.form_data_json.items():
            if k not in resp_dict:
                resp_dict[k] = v

    resp_dict["business_name"] = project.business_name
    resp_dict["dpr_type"] = project.dpr_type
    resp_dict["sector_id"] = project.sector_id
    resp_dict["activity_id"] = project.activity_id

    return {"success": True, "project_id": project_id, "responses": resp_dict}

@router.put("/projects/{project_id}/responses/{question_key}")
async def autosave_single_response(
    project_id: str,
    question_key: str,
    req: SingleResponseRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    if current_user and project.user_id and project.user_id != current_user.id and current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to project responses.")

    # Upsert response record with data provenance
    existing = db.query(DPRResponseDB).filter(
        DPRResponseDB.project_id == project_id,
        DPRResponseDB.question_key == question_key
    ).first()

    if existing:
        existing.value_json = req.value
        existing.source = req.source or "USER_PROVIDED"
        existing.question_version = req.question_version or "1.0.0"
    else:
        new_resp = DPRResponseDB(
            project_id=project_id,
            user_id=current_user.id if current_user else None,
            question_id=f"q_{question_key}",
            question_key=question_key,
            question_version=req.question_version or "1.0.0",
            value_json=req.value,
            source=req.source or "USER_PROVIDED"
        )
        db.add(new_resp)

    # Update form_data_json cache on project
    current_form = dict(project.form_data_json or {})
    current_form[question_key] = req.value
    project.form_data_json = current_form

    db.commit()

    return {
        "success": True,
        "message": f"Autosaved response for '{question_key}'.",
        "save_state": "Saved",
        "question_key": question_key,
        "value": req.value
    }

@router.post("/projects/{project_id}/responses")
async def batch_save_responses(
    project_id: str,
    req: BatchResponsesRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    if current_user and project.user_id and project.user_id != current_user.id and current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to project responses.")

    current_form = dict(project.form_data_json or {})

    for key, val in req.responses.items():
        existing = db.query(DPRResponseDB).filter(
            DPRResponseDB.project_id == project_id,
            DPRResponseDB.question_key == key
        ).first()

        if existing:
            existing.value_json = val
            existing.source = req.source or "USER_PROVIDED"
        else:
            db.add(DPRResponseDB(
                project_id=project_id,
                user_id=current_user.id if current_user else None,
                question_id=f"q_{key}",
                question_key=key,
                value_json=val,
                source=req.source or "USER_PROVIDED"
            ))

        current_form[key] = val

    project.form_data_json = current_form
    db.commit()

    return {
        "success": True,
        "message": f"Batch saved {len(req.responses)} question responses.",
        "save_state": "Saved"
    }

@router.get("/projects/{project_id}/progress")
async def get_project_progress(project_id: str, db: Session = Depends(get_db)):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    # 1. Fetch Blueprint
    resolved_bp = DynamicBlueprintResolver.resolve_blueprint(
        dpr_type=project.dpr_type,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        project_type_id=project.project_type_id,
        geography_id=project.geography_id,
        project_scale=project.project_scale,
        db=db
    )

    # 2. Fetch User Responses
    db_responses = db.query(DPRResponseDB).filter(DPRResponseDB.project_id == project_id).all()
    user_responses = {r.question_key: r.value_json for r in db_responses}
    if project.form_data_json:
        for k, v in project.form_data_json.items():
            if k not in user_responses:
                user_responses[k] = v

    progress = DynamicQuestionEngine.calculate_progress(resolved_bp, user_responses)
    return {"success": True, "project_id": project_id, "progress": progress}

@router.post("/projects/{project_id}/validate")
async def validate_project_responses_endpoint(project_id: str, db: Session = Depends(get_db)):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    resolved_bp = DynamicBlueprintResolver.resolve_blueprint(
        dpr_type=project.dpr_type,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        db=db
    )

    db_responses = db.query(DPRResponseDB).filter(DPRResponseDB.project_id == project_id).all()
    user_responses = {r.question_key: r.value_json for r in db_responses}
    if project.form_data_json:
        for k, v in project.form_data_json.items():
            if k not in user_responses:
                user_responses[k] = v

    resolved_qs = DynamicQuestionEngine.resolve_questions_for_project(resolved_bp, user_responses)
    is_valid, errors = DynamicQuestionEngine.validate_responses(resolved_qs, user_responses)

    return {
        "success": True,
        "is_valid": is_valid,
        "errors": errors,
        "error_count": len(errors)
    }
