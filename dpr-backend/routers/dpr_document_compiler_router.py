from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRProjectDB, DPRCompiledDocumentDB, UserDB
from dpr_engine.document.compiler.document_compiler import DocumentCompiler
from routers.auth_router import get_current_user_obj

router = APIRouter(prefix="/api/projects", tags=["DPR Document Compiler Engine"])

class CompileDocumentRequest(BaseModel):
    snapshot_id: str
    format: str = Field("PDF", example="PDF")  # PDF, DOCX, HTML

def _check_project_access(project: DPRProjectDB, current_user: Optional[UserDB]):
    if current_user and project.user_id and project.user_id != current_user.id and current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to project document compiler.")

@router.post("/{project_id}/documents/compile")
async def compile_project_document(
    project_id: str,
    req: CompileDocumentRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    res = await DocumentCompiler.compile_document(project_id, req.snapshot_id, req.format, db)
    return res

@router.get("/{project_id}/documents")
async def list_project_documents(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    docs = db.query(DPRCompiledDocumentDB).filter(DPRCompiledDocumentDB.project_id == project_id).all()
    return {
        "success": True,
        "project_id": project_id,
        "documents": [
            {
                "document_id": d.id, "snapshot_id": d.snapshot_id, "dpr_type": d.dpr_type,
                "format": d.format, "status": d.status, "page_count": d.page_count,
                "quality_score": d.quality_score, "checksum_sha256": d.checksum_sha256,
                "file_size_bytes": d.file_size_bytes, "created_at": d.created_at
            }
            for d in docs
        ]
    }

@router.get("/{project_id}/documents/{document_id}")
async def get_document_details(
    project_id: str,
    document_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    doc = db.query(DPRCompiledDocumentDB).filter(
        DPRCompiledDocumentDB.id == document_id,
        DPRCompiledDocumentDB.project_id == project_id
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")

    return {
        "success": True,
        "document_id": doc.id,
        "project_id": doc.project_id,
        "snapshot_id": doc.snapshot_id,
        "dpr_type": doc.dpr_type,
        "format": doc.format,
        "status": doc.status,
        "page_count": doc.page_count,
        "quality_score": doc.quality_score,
        "checksum_sha256": doc.checksum_sha256,
        "file_size_bytes": doc.file_size_bytes,
        "storage_path": doc.storage_path,
        "manifest": doc.manifest_json
    }

@router.get("/{project_id}/documents/{document_id}/status")
async def get_document_status(
    project_id: str,
    document_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    doc = db.query(DPRCompiledDocumentDB).filter(DPRCompiledDocumentDB.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")

    return {
        "success": True,
        "document_id": doc.id,
        "status": doc.status,
        "progress_percent": 100 if doc.status == "COMPLETED" else doc.progress_percent,
        "step_name": doc.step_name,
        "quality_score": doc.quality_score
    }

@router.get("/{project_id}/documents/{document_id}/manifest")
async def get_document_manifest(
    project_id: str,
    document_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    doc = db.query(DPRCompiledDocumentDB).filter(DPRCompiledDocumentDB.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")

    return {"success": True, "document_id": doc.id, "manifest": doc.manifest_json}

@router.post("/{project_id}/documents/{document_id}/recompile")
async def recompile_document(
    project_id: str,
    document_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    doc = db.query(DPRCompiledDocumentDB).filter(DPRCompiledDocumentDB.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")

    return await DocumentCompiler.compile_document(project_id, doc.snapshot_id, doc.format, db)
