from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRProjectDB, DPRResearchSourceDB, DPRRiskItemDB, UserDB
from dpr_engine.intelligence.snapshot_engine import IntelligenceSnapshotEngine
from dpr_engine.intelligence.research_engine import ResearchEngine
from dpr_engine.intelligence.scheme_engine import SchemeKnowledgeEngine
from dpr_engine.financials.canonical_model import DPRProjectData
from routers.auth_router import get_current_user_obj

router = APIRouter(prefix="/api/projects", tags=["DPR Intelligence, Research & Knowledge Engine"])

def _check_project_access(project: DPRProjectDB, current_user: Optional[UserDB]):
    if current_user and project.user_id and project.user_id != current_user.id and current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to project intelligence data.")

@router.get("/{project_id}/intelligence")
@router.post("/{project_id}/intelligence/refresh")
async def get_project_intelligence_snapshot(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    snapshot = IntelligenceSnapshotEngine.get_snapshot(project_id, db)
    return {"success": True, "project_id": project_id, "snapshot": snapshot}

@router.get("/{project_id}/research")
async def get_project_research(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    sources = db.query(DPRResearchSourceDB).filter(DPRResearchSourceDB.project_id == project_id).all()
    return {
        "success": True,
        "project_id": project_id,
        "sources": [
            {
                "id": s.id, "title": s.title, "url": s.url, "source_name": s.source_name,
                "summary": s.summary, "confidence": s.confidence, "retrieved_at": s.retrieved_at
            }
            for s in sources
        ]
    }

@router.post("/{project_id}/research/run")
async def run_project_research(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    res = ResearchEngine.execute_sector_research(
        project_id=project.id,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        geography_id=project.geography_id,
        db=db
    )
    return res

@router.get("/{project_id}/schemes")
@router.post("/{project_id}/schemes/match")
async def match_project_schemes(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    snapshot = IntelligenceSnapshotEngine.get_snapshot(project_id, db)
    return {
        "success": True,
        "project_id": project_id,
        "matched_schemes": snapshot.get("schemes", [])
    }

@router.get("/{project_id}/risks")
async def get_project_risks(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    risks = db.query(DPRRiskItemDB).filter(DPRRiskItemDB.project_id == project_id).all()
    return {
        "success": True,
        "project_id": project_id,
        "risks": [
            {
                "id": r.id, "category": r.category, "description": r.description,
                "severity": r.severity, "likelihood": r.likelihood,
                "impact": r.impact, "mitigation": r.mitigation
            }
            for r in risks
        ]
    }

@router.get("/{project_id}/validation")
async def get_project_validation_findings(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    snapshot_res = await get_project_intelligence_snapshot(project_id, db, current_user)
    snapshot = snapshot_res.get("snapshot", {})
    return {
        "success": True,
        "project_id": project_id,
        "financial_status": snapshot.get("financial_status"),
        "validation_warnings": snapshot.get("validation_warnings", [])
    }
