from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRProjectDB, DPRBlueprintDB, UserDB
from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver
from routers.auth_router import get_current_user_obj

router = APIRouter(prefix="/api/blueprint", tags=["DPR Blueprint & Architecture Engine"])

# Request Schemas
class ResolveBlueprintRequest(BaseModel):
    dpr_type: str = Field(..., example="Bank Loan DPR")
    sector_id: Optional[str] = "manufacturing"
    activity_id: Optional[str] = "spice_processing"
    project_type_id: Optional[str] = "new_project"
    geography_id: Optional[str] = "IN-KA"
    project_scale: Optional[str] = "medium"

class CreateDPRProjectRequest(BaseModel):
    business_name: str
    dpr_type: str
    sector_id: str
    activity_id: str
    project_type_id: Optional[str] = "new_project"
    geography_id: Optional[str] = "IN-KA"
    project_scale: Optional[str] = "medium"
    form_data: Optional[Dict[str, Any]] = None

@router.get("/dpr-types")
async def get_dpr_types():
    return {"success": True, "data": DynamicBlueprintResolver.get_dpr_types()}

@router.get("/sectors")
async def list_sectors(db: Session = Depends(get_db)):
    sectors = DynamicBlueprintResolver.get_sectors(db)
    return {"success": True, "data": sectors}

@router.get("/sectors/{sector_id}/activities")
async def list_sector_activities(sector_id: str, db: Session = Depends(get_db)):
    activities = DynamicBlueprintResolver.get_activities_by_sector(sector_id, db)
    return {"success": True, "sector_id": sector_id, "data": activities}

@router.get("/project-types")
async def list_project_types(db: Session = Depends(get_db)):
    types = DynamicBlueprintResolver.get_project_types(db)
    return {"success": True, "data": types}

@router.get("/geographies")
async def list_geographies(db: Session = Depends(get_db)):
    geos = DynamicBlueprintResolver.get_geographies(db)
    return {"success": True, "data": geos}

@router.post("/resolve")
async def resolve_dpr_blueprint(req: ResolveBlueprintRequest, db: Session = Depends(get_db)):
    resolved = DynamicBlueprintResolver.resolve_blueprint(
        dpr_type=req.dpr_type,
        sector_id=req.sector_id or "manufacturing",
        activity_id=req.activity_id or "spice_processing",
        project_type_id=req.project_type_id or "new_project",
        geography_id=req.geography_id or "IN-KA",
        project_scale=req.project_scale or "medium",
        db=db
    )
    return {"success": True, "blueprint": resolved}

@router.post("/projects")
async def create_dpr_project(
    req: CreateDPRProjectRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    resolved = DynamicBlueprintResolver.resolve_blueprint(
        dpr_type=req.dpr_type,
        sector_id=req.sector_id,
        activity_id=req.activity_id,
        project_type_id=req.project_type_id,
        geography_id=req.geography_id,
        project_scale=req.project_scale,
        db=db
    )

    project = DPRProjectDB(
        user_id=current_user.id if current_user else None,
        business_name=req.business_name,
        dpr_type=req.dpr_type,
        sector_id=req.sector_id,
        activity_id=req.activity_id,
        project_type_id=req.project_type_id,
        geography_id=req.geography_id,
        project_scale=req.project_scale,
        blueprint_id=resolved["blueprint_id"],
        blueprint_version=resolved["version"],
        form_data_json=req.form_data or {},
        status="DRAFT"
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "success": True,
        "message": "DPR Project successfully created.",
        "project_id": project.id,
        "blueprint_version": project.blueprint_version,
        "blueprint": resolved
    }

@router.get("/projects/{project_id}")
async def get_dpr_project_details(project_id: str, db: Session = Depends(get_db)):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    return {
        "success": True,
        "data": {
            "id": project.id,
            "business_name": project.business_name,
            "dpr_type": project.dpr_type,
            "sector_id": project.sector_id,
            "activity_id": project.activity_id,
            "project_type_id": project.project_type_id,
            "geography_id": project.geography_id,
            "project_scale": project.project_scale,
            "blueprint_id": project.blueprint_id,
            "blueprint_version": project.blueprint_version,
            "status": project.status,
            "created_at": project.created_at,
            "updated_at": project.updated_at
        }
    }

@router.get("/projects/{project_id}/blueprint")
async def get_project_blueprint(project_id: str, db: Session = Depends(get_db)):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    resolved = DynamicBlueprintResolver.resolve_blueprint(
        dpr_type=project.dpr_type,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        project_type_id=project.project_type_id,
        geography_id=project.geography_id,
        project_scale=project.project_scale,
        db=db
    )
    return {"success": True, "project_id": project.id, "blueprint": resolved}

@router.get("/projects/{project_id}/sections")
async def get_project_sections(project_id: str, db: Session = Depends(get_db)):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    resolved = DynamicBlueprintResolver.resolve_blueprint(
        dpr_type=project.dpr_type,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        db=db
    )
    return {"success": True, "project_id": project.id, "sections": resolved.get("sections", [])}

@router.get("/projects/{project_id}/questions")
async def get_project_questions(project_id: str, db: Session = Depends(get_db)):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")

    resolved = DynamicBlueprintResolver.resolve_blueprint(
        dpr_type=project.dpr_type,
        sector_id=project.sector_id,
        activity_id=project.activity_id,
        db=db
    )
    return {"success": True, "project_id": project.id, "questions": resolved.get("questions", [])}
