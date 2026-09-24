from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from models.database_models import DPRProjectDB, DPRResponseDB, DPRResearchSourceDB, DPRSchemeRuleDB
from dpr_engine.financials.canonical_model import DPRProjectData
from dpr_engine.financials.financial_intelligence import FinancialIntelligenceEngine
from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver

class ProjectDataTool:
    @staticmethod
    def get_canonical_project(project_id: str, db: Session) -> Dict[str, Any]:
        project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
        if not project:
            return {}

        db_responses = db.query(DPRResponseDB).filter(DPRResponseDB.project_id == project_id).all()
        user_responses = {r.question_key: r.value_json for r in db_responses}
        if project.form_data_json:
            for k, v in project.form_data_json.items():
                if k not in user_responses:
                    user_responses[k] = v

        return DPRProjectData.from_project_and_responses(
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

class FinancialDataTool:
    @staticmethod
    def get_financial_model_results(canonical_data: Dict[str, Any]) -> Dict[str, Any]:
        # Read-only access to output of authoritative deterministic financial engine
        return FinancialIntelligenceEngine.compute(canonical_data)

class SchemeTool:
    @staticmethod
    def get_active_schemes(sector_id: str, db: Session) -> List[Dict[str, Any]]:
        db_schemes = db.query(DPRSchemeRuleDB).filter(DPRSchemeRuleDB.is_active == True).all()
        if db_schemes:
            return [
                {
                    "id": s.id, "scheme_name": s.scheme_name, "authority": s.authority,
                    "version": s.version, "eligibility_rules": s.eligibility_rules_json
                }
                for s in db_schemes
            ]

        # Seed fallback schemes
        return [
            {
                "id": "pmegp_scheme_v1.0",
                "scheme_name": "Prime Minister Employment Generation Programme (PMEGP)",
                "authority": "KVIC / Ministry of MSME",
                "version": "1.0.0",
                "eligibility_rules": {"max_project_cost": 5000000, "general_subsidy_pct": 25, "special_subsidy_pct": 35}
            },
            {
                "id": "standup_india_v1.0",
                "scheme_name": "Stand-Up India Scheme for SC/ST/Women",
                "authority": "SIDBI / Ministry of Finance",
                "version": "1.0.0",
                "eligibility_rules": {"target_beneficiaries": ["SC", "ST", "Women"], "loan_range": "10L - 100L"}
            }
        ]

class ResearchTool:
    @staticmethod
    def get_research_sources(project_id: str, db: Session) -> List[Dict[str, Any]]:
        sources = db.query(DPRResearchSourceDB).filter(DPRResearchSourceDB.project_id == project_id).all()
        return [
            {"id": s.id, "title": s.title, "url": s.url, "source_name": s.source_name, "summary": s.summary, "confidence": s.confidence}
            for s in sources
        ]
