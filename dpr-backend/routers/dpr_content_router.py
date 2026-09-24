from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRProjectDB, DPRContentPackageDB, DPRContentSectionDB, UserDB
from dpr_engine.content.content_generator import DPRContentGenerator
from dpr_engine.content.content_planner import DPRContentPlanner
from dpr_engine.content.content_snapshot import ContentSnapshotBuilder
from dpr_engine.content.content_validator import ContentCompletenessCalculator, FinancialContentValidator
from routers.auth_router import get_current_user_obj

router = APIRouter(prefix="/api/projects", tags=["DPR Content Generation Engine"])

class RegenerateSectionRequest(BaseModel):
    user_feedback: Optional[str] = None

def _check_project_access(project: DPRProjectDB, current_user: Optional[UserDB]):
    if current_user and project.user_id and project.user_id != current_user.id and current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to project content package.")

@router.post("/{project_id}/content/plan")
async def plan_project_content(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    cost = project.form_data_json.get("total_cost", 25000000.0) if project.form_data_json else 25000000.0
    plan = DPRContentPlanner.create_content_plan(
        dpr_type=project.dpr_type,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        project_cost=cost,
        project_scale=project.project_scale,
        db=db
    )
    return {"success": True, "project_id": project_id, "content_plan": plan}

@router.post("/{project_id}/content/generate")
async def generate_full_project_content(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    pkg = DPRContentGenerator.initialize_content_package(project_id, db)
    sections = db.query(DPRContentSectionDB).filter(DPRContentSectionDB.package_id == pkg.id).all()

    gen_results = []
    for s in sections:
        res = DPRContentGenerator.generate_section_content(project_id, s.section_key, None, db)
        gen_results.append(res)

    return {
        "success": True,
        "project_id": project_id,
        "package_id": pkg.id,
        "sections_generated": len(gen_results),
        "overall_completeness": pkg.overall_completeness
    }

@router.get("/{project_id}/content")
async def get_project_content_package(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    pkg = db.query(DPRContentPackageDB).filter(DPRContentPackageDB.project_id == project_id).first()
    if not pkg:
        pkg = DPRContentGenerator.initialize_content_package(project_id, db)

    sections = db.query(DPRContentSectionDB).filter(DPRContentSectionDB.package_id == pkg.id).all()
    return {
        "success": True,
        "project_id": project_id,
        "package": {
            "id": pkg.id,
            "dpr_type": pkg.dpr_type,
            "blueprint_id": pkg.blueprint_id,
            "target_depth": pkg.target_depth,
            "overall_completeness": pkg.overall_completeness,
            "sections": [
                {
                    "section_key": s.section_key,
                    "title": s.title,
                    "display_order": s.display_order,
                    "status": s.status,
                    "content_blocks": s.content_blocks_json,
                    "tables": s.tables_json,
                    "charts": s.chart_references_json,
                    "approval_status": s.approval_status
                }
                for s in sections
            ]
        }
    }

@router.get("/{project_id}/content/progress")
async def get_content_progress(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    sections = db.query(DPRContentSectionDB).filter(DPRContentSectionDB.project_id == project_id).all()
    sec_dicts = [{"section_key": s.section_key, "status": s.status} for s in sections]
    comp = ContentCompletenessCalculator.calculate_completeness(sec_dicts)
    return {"success": True, "project_id": project_id, "progress": comp}

@router.get("/{project_id}/content/{section_key}")
async def get_section_content(
    project_id: str,
    section_key: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    sec = db.query(DPRContentSectionDB).filter(
        DPRContentSectionDB.project_id == project_id,
        DPRContentSectionDB.section_key == section_key
    ).first()
    if not sec:
        raise HTTPException(status_code=404, detail=f"Section '{section_key}' not found.")

    return {
        "success": True,
        "section_key": sec.section_key,
        "title": sec.title,
        "status": sec.status,
        "content_blocks": sec.content_blocks_json,
        "tables": sec.tables_json,
        "charts": sec.chart_references_json,
        "warnings": sec.warnings_json,
        "approval_status": sec.approval_status
    }

@router.post("/{project_id}/content/{section_key}/regenerate")
async def regenerate_single_section(
    project_id: str,
    section_key: str,
    req: RegenerateSectionRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    return DPRContentGenerator.generate_section_content(project_id, section_key, req.user_feedback, db)

@router.post("/{project_id}/content/{section_key}/approve")
async def approve_section_content(
    project_id: str,
    section_key: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    sec = db.query(DPRContentSectionDB).filter(
        DPRContentSectionDB.project_id == project_id,
        DPRContentSectionDB.section_key == section_key
    ).first()
    if not sec:
        raise HTTPException(status_code=404, detail=f"Section '{section_key}' not found.")

    sec.status = "APPROVED"
    sec.approval_status = "APPROVED"
    db.commit()
    return {"success": True, "message": f"Section '{section_key}' APPROVED successfully."}

@router.post("/{project_id}/content/{section_key}/reject")
async def reject_section_content(
    project_id: str,
    section_key: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    sec = db.query(DPRContentSectionDB).filter(
        DPRContentSectionDB.project_id == project_id,
        DPRContentSectionDB.section_key == section_key
    ).first()
    if not sec:
        raise HTTPException(status_code=404, detail=f"Section '{section_key}' not found.")

    sec.status = "REJECTED"
    sec.approval_status = "REJECTED"
    db.commit()
    return {"success": True, "message": f"Section '{section_key}' REJECTED."}

@router.post("/{project_id}/content/validate")
async def validate_project_content(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    sections = db.query(DPRContentSectionDB).filter(DPRContentSectionDB.project_id == project_id).all()
    all_warnings = []
    for s in sections:
        res = FinancialContentValidator.validate_section_financials(project_id, s.section_key, s.content_blocks_json or [], db)
        all_warnings.extend(res["warnings"])

    return {"success": True, "project_id": project_id, "warnings_count": len(all_warnings), "warnings": all_warnings}

@router.post("/{project_id}/content/snapshot")
async def create_content_snapshot(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    return ContentSnapshotBuilder.create_immutable_snapshot(project_id, db)
