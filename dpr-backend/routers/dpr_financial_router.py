from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRProjectDB, DPRResponseDB, UserDB
from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver
from dpr_engine.financials.canonical_model import DPRProjectData
from dpr_engine.financials.financial_intelligence import FinancialIntelligenceEngine
from routers.auth_router import get_current_user_obj

router = APIRouter(prefix="/api/projects", tags=["DPR Financial Intelligence Engine"])

def _check_project_access(project: DPRProjectDB, current_user: Optional[UserDB]):
    if current_user and project.user_id and project.user_id != current_user.id and current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to project financial data.")

@router.get("/{project_id}/data")
async def get_project_canonical_data(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    db_responses = db.query(DPRResponseDB).filter(DPRResponseDB.project_id == project_id).all()
    user_responses = {r.question_key: r.value_json for r in db_responses}
    if project.form_data_json:
        for k, v in project.form_data_json.items():
            if k not in user_responses:
                user_responses[k] = v

    canonical = DPRProjectData.from_project_and_responses(
        project_id=project.id,
        business_name=project.business_name,
        dpr_type=project.dpr_type,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        project_type_id=project.project_type_id,
        geography_id=project.geography_id,
        project_scale=project.project_scale,
        blueprint_id=project.blueprint_id,
        blueprint_version=project.blueprint_version,
        responses=user_responses
    )
    return {"success": True, "project_id": project_id, "canonical_data": canonical}

@router.post("/{project_id}/build-data")
async def build_project_canonical_data(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    return await get_project_canonical_data(project_id, db, current_user)

@router.get("/{project_id}/financial-model")
@router.post("/{project_id}/calculate")
async def compute_project_financial_model(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    db_responses = db.query(DPRResponseDB).filter(DPRResponseDB.project_id == project_id).all()
    user_responses = {r.question_key: r.value_json for r in db_responses}
    if project.form_data_json:
        for k, v in project.form_data_json.items():
            if k not in user_responses:
                user_responses[k] = v

    canonical = DPRProjectData.from_project_and_responses(
        project_id=project.id,
        business_name=project.business_name,
        dpr_type=project.dpr_type,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        project_type_id=project.project_type_id,
        geography_id=project.geography_id,
        project_scale=project.project_scale,
        blueprint_id=project.blueprint_id,
        blueprint_version=project.blueprint_version,
        responses=user_responses
    )

    calculation_result = FinancialIntelligenceEngine.compute(canonical)
    return {"success": True, "project_id": project_id, "data": calculation_result}

@router.post("/{project_id}/validate-financials")
async def validate_project_financials(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    res = await compute_project_financial_model(project_id, db, current_user)
    data = res.get("data", {})
    return {
        "success": True,
        "is_valid": data.get("is_valid", True),
        "validation_logs": data.get("validation_logs", [])
    }

@router.get("/{project_id}/financial-summary")
async def get_project_financial_summary(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    res = await compute_project_financial_model(project_id, db, current_user)
    data = res.get("data", {})
    fin_results = data.get("financial_model_results", {})
    chart_datasets = data.get("chart_datasets", {})

    return {
        "success": True,
        "project_id": project_id,
        "dpr_type": data.get("dpr_type"),
        "summary_kpis": {
            "total_project_cost": fin_results.get("total_project_cost"),
            "bank_loan": fin_results.get("bank_loan"),
            "promoter_equity": fin_results.get("promoter_equity"),
            "avg_dscr": fin_results.get("avg_dscr"),
            "bep_percent": fin_results.get("bep_percent")
        },
        "chart_datasets": chart_datasets
    }
