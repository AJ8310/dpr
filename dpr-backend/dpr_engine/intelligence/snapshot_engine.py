from typing import Dict, Any, List
from sqlalchemy.orm import Session

from models.database_models import DPRProjectDB, DPRResponseDB, DPRResearchSourceDB
from dpr_engine.financials.canonical_model import DPRProjectData
from dpr_engine.financials.financial_intelligence import FinancialIntelligenceEngine
from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver
from dpr_engine.questions.question_engine import DynamicQuestionEngine
from dpr_engine.intelligence.scheme_engine import SchemeKnowledgeEngine
from dpr_engine.intelligence.risk_engine import RiskIntelligenceEngine
from dpr_engine.intelligence.research_engine import ResearchEngine

class IntelligenceSnapshotEngine:
    """
    Aggregates overall Project Intelligence Snapshot across Completeness, Financials, Schemes, Risks, and Evidence.
    """

    @classmethod
    def get_snapshot(cls, project_id: str, db: Session) -> Dict[str, Any]:
        project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
        if not project:
            return {}

        # 1. Fetch Responses & Canonical Data
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

        # 2. Financial Intelligence & Validation
        fin_computation = FinancialIntelligenceEngine.compute(canonical)
        fin_results = fin_computation.get("financial_model_results", {})
        validation_logs = fin_computation.get("validation_logs", [])

        # 3. Question Progress
        resolved_bp = DynamicBlueprintResolver.resolve_blueprint(
            dpr_type=project.dpr_type, sector_id=project.sector_id, activity_id=project.activity_id, db=db
        )
        progress = DynamicQuestionEngine.calculate_progress(resolved_bp, user_responses)

        # 4. Schemes & Risks
        schemes = SchemeKnowledgeEngine.evaluate_project_schemes(canonical, db)
        risks = RiskIntelligenceEngine.evaluate_project_risks(project_id, canonical, fin_results, db)

        # 5. Research Sources
        sources = db.query(DPRResearchSourceDB).filter(DPRResearchSourceDB.project_id == project_id).all()

        completeness_pct = progress.get("overall_completion_percent", 0)
        overall_status = "READY_FOR_GENERATION" if completeness_pct >= 80 and fin_computation.get("is_valid") else "NEEDS_REVIEW"

        return {
            "project_id": project_id,
            "business_name": project.business_name,
            "dpr_type": project.dpr_type,
            "overall_status": overall_status,
            "data_completeness_percent": completeness_pct,
            "financial_status": "PASS" if fin_computation.get("is_valid") else "ATTENTION_REQUIRED",
            "market_research_status": "COMPLETED" if len(sources) > 0 else "PENDING",
            "matched_schemes_count": len([s for s in schemes if s["status"] == "POTENTIALLY_APPLICABLE"]),
            "schemes": schemes,
            "risks_summary": {"total": len(risks), "high_severity": len([r for r in risks if r["severity"] == "HIGH"])},
            "validation_warnings": [l["message"] for l in validation_logs if l["severity"] == "WARNING"],
            "total_research_sources": len(sources),
            "progress_summary": progress
        }
