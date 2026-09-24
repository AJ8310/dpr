import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from models.database_models import DPRAgentTaskDB, DPRAgentResultDB, DPRProjectDB
from dpr_engine.agents.specialized_agents import (
    DPRPrivacyAgent, DPRResearchAgent, MarketAnalysisAgent,
    GovernmentSchemeAgent, FinancialAnalysisAgent,
    DPRValidationAgent, DPRContentAgent, RiskAgent,
    CreditScoringAgent
)

class AgentOrchestrator:

    AGENT_REGISTRY = {
        "privacy_agent": DPRPrivacyAgent(),
        "research_agent": DPRResearchAgent(),
        "market_agent": MarketAnalysisAgent(),
        "scheme_agent": GovernmentSchemeAgent(),
        "risk_agent": RiskAgent(),
        "financial_agent": FinancialAnalysisAgent(),
        "credit_agent": CreditScoringAgent(),
        "validation_agent": DPRValidationAgent(),
        "content_agent": DPRContentAgent()
    }

    WORKFLOW_MAP = {
        "Bank Loan DPR": ["privacy_agent", "research_agent", "market_agent", "risk_agent", "financial_agent", "credit_agent", "validation_agent", "content_agent"],
        "Govt Subsidy DPR": ["privacy_agent", "research_agent", "scheme_agent", "risk_agent", "financial_agent", "credit_agent", "validation_agent", "content_agent"],
        "Investor / Business Pitch DPR": ["privacy_agent", "market_agent", "research_agent", "risk_agent", "financial_agent", "credit_agent", "validation_agent", "content_agent"]
    }

    @classmethod
    def run_agent_task(
        cls,
        project_id: str,
        agent_id: str,
        db: Session,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        agent = cls.AGENT_REGISTRY.get(agent_id)
        if not agent:
            raise ValueError(f"Unknown agent ID '{agent_id}'.")

        # 1. Create persistent task record
        task = DPRAgentTaskDB(
            project_id=project_id,
            agent_id=agent_id,
            agent_version=agent.version,
            status="RUNNING",
            input_reference_json=context or {},
            started_at=datetime.datetime.now()
        )
        db.add(task)
        db.commit()
        db.refresh(task)

        try:
            # 2. Execute specialized agent safely
            output = agent.run(project_id, db, context)

            # 3. Store result record
            confidence = float(output.get("confidence", 0.95))
            findings = output.get("findings", [])
            recommendations = output.get("recommendations", [])
            sources = output.get("sources", [])
            warnings = output.get("warnings", [])

            # Human Approval required for suggestions
            approval_status = "PENDING_APPROVAL" if agent_id in ["intake_agent", "scheme_agent"] else "NOT_REQUIRED"

            result_rec = DPRAgentResultDB(
                task_id=task.id,
                project_id=project_id,
                agent_id=agent_id,
                agent_version=agent.version,
                confidence=confidence,
                findings_json=findings,
                recommendations_json=recommendations,
                sources_json=sources,
                warnings_json=warnings,
                approval_status=approval_status
            )
            db.add(result_rec)

            task.status = "COMPLETED"
            task.completed_at = datetime.datetime.now()
            task.output_reference_json = {"result_id": result_rec.id, "confidence": confidence}
            db.commit()

            return {
                "success": True,
                "task_id": task.id,
                "agent_id": agent_id,
                "status": "COMPLETED",
                "output": output,
                "approval_status": approval_status
            }

        except Exception as e:
            task.status = "FAILED"
            task.error = str(e)
            db.commit()
            return {
                "success": False,
                "task_id": task.id,
                "agent_id": agent_id,
                "status": "FAILED",
                "error": str(e)
            }

    @classmethod
    def approve_suggestion(cls, task_id: str, db: Session) -> Dict[str, Any]:
        rec = db.query(DPRAgentResultDB).filter(DPRAgentResultDB.task_id == task_id).first()
        if not rec:
            return {"success": False, "message": "Task result record not found."}
        rec.approval_status = "APPROVED"
        db.commit()
        return {"success": True, "message": f"Suggestion from task '{task_id}' APPROVED and marked as USER_CONFIRMED."}

    @classmethod
    def reject_suggestion(cls, task_id: str, db: Session) -> Dict[str, Any]:
        rec = db.query(DPRAgentResultDB).filter(DPRAgentResultDB.task_id == task_id).first()
        if not rec:
            return {"success": False, "message": "Task result record not found."}
        rec.approval_status = "REJECTED"
        db.commit()
        return {"success": True, "message": f"Suggestion from task '{task_id}' REJECTED."}
