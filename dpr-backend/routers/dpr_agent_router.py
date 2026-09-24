from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRProjectDB, DPRAgentTaskDB, DPRAgentResultDB, UserDB
from dpr_engine.agents.agent_orchestrator import AgentOrchestrator
from routers.auth_router import get_current_user_obj

router = APIRouter(prefix="/api/projects", tags=["DPR Intelligence & Agent Architecture"])

class RunAgentRequest(BaseModel):
    agent_id: str = Field(..., example="intake_agent")  # intake_agent, research_agent, market_agent, scheme_agent, financial_agent, validation_agent, content_agent
    context: Optional[Dict[str, Any]] = None

def _check_project_access(project: DPRProjectDB, current_user: Optional[UserDB]):
    if current_user and project.user_id and project.user_id != current_user.id and current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to project agent tasks.")

@router.post("/{project_id}/agents/run")
async def run_agent_task(
    project_id: str,
    req: RunAgentRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    res = AgentOrchestrator.run_agent_task(
        project_id=project_id,
        agent_id=req.agent_id,
        db=db,
        context=req.context
    )
    return res

@router.get("/{project_id}/agents/tasks")
async def list_project_agent_tasks(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    tasks = db.query(DPRAgentTaskDB).filter(DPRAgentTaskDB.project_id == project_id).all()
    return {
        "success": True,
        "project_id": project_id,
        "tasks": [
            {
                "task_id": t.id, "agent_id": t.agent_id, "status": t.status,
                "started_at": t.started_at, "completed_at": t.completed_at
            }
            for t in tasks
        ]
    }

@router.get("/{project_id}/agents/tasks/{task_id}")
async def get_agent_task_status(
    project_id: str,
    task_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    task = db.query(DPRAgentTaskDB).filter(DPRAgentTaskDB.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Agent Task ID not found.")

    res = db.query(DPRAgentResultDB).filter(DPRAgentResultDB.task_id == task_id).first()

    return {
        "success": True,
        "task_id": task.id,
        "agent_id": task.agent_id,
        "status": task.status,
        "error": task.error,
        "result": {
            "confidence": res.confidence,
            "findings": res.findings_json,
            "recommendations": res.recommendations_json,
            "approval_status": res.approval_status
        } if res else None
    }

@router.get("/{project_id}/agents/results")
async def get_project_agent_results(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    results = db.query(DPRAgentResultDB).filter(DPRAgentResultDB.project_id == project_id).all()
    return {
        "success": True,
        "project_id": project_id,
        "results": [
            {
                "task_id": r.task_id, "agent_id": r.agent_id, "confidence": r.confidence,
                "findings": r.findings_json, "recommendations": r.recommendations_json,
                "approval_status": r.approval_status
            }
            for r in results
        ]
    }

@router.post("/{project_id}/agents/{task_id}/approve")
async def approve_agent_suggestion(
    project_id: str,
    task_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    return AgentOrchestrator.approve_suggestion(task_id, db)

@router.post("/{project_id}/agents/{task_id}/reject")
async def reject_agent_suggestion(
    project_id: str,
    task_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_obj)
):
    project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="DPR Project not found.")
    _check_project_access(project, current_user)

    return AgentOrchestrator.reject_suggestion(task_id, db)
