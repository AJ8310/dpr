from typing import Dict, Any
from sqlalchemy.orm import Session
from dpr_engine.agents.agent_tools import ProjectDataTool, FinancialDataTool, ResearchTool, SchemeTool

class SectionContextBuilder:
    """
    Builds minimal relevant context per section (least-context architecture).
    """

    @classmethod
    def build_context(cls, section_key: str, project_id: str, db: Session) -> Dict[str, Any]:
        canonical = ProjectDataTool.get_canonical_project(project_id, db)
        fin_computation = FinancialDataTool.get_financial_model_results(canonical)

        base_ctx = {
            "project_id": project_id,
            "business_name": canonical.get("project", {}).get("business_name"),
            "dpr_type": canonical.get("project", {}).get("dpr_type"),
            "sector_id": canonical.get("classification", {}).get("sector_id"),
            "geography_id": canonical.get("classification", {}).get("geography_id")
        }

        if section_key == "sec_exec":
            base_ctx.update({
                "project_cost": canonical.get("project_cost"),
                "funding": canonical.get("funding"),
                "financial_summary": fin_computation.get("financial_model_results", {}).get("summary")
            })
        elif section_key in ["sec_cost", "sec_financials"]:
            base_ctx.update({
                "project_cost": canonical.get("project_cost"),
                "funding": canonical.get("funding"),
                "financial_model_results": fin_computation.get("financial_model_results"),
                "reconciliation": fin_computation.get("reconciliation")
            })
        elif section_key == "sec_market":
            sources = ResearchTool.get_research_sources(project_id, db)
            base_ctx.update({
                "activity_id": canonical.get("classification", {}).get("activity_id"),
                "research_sources": sources
            })
        elif section_key == "sec_schemes":
            schemes = SchemeTool.get_active_schemes(canonical.get("classification", {}).get("sector_id"), db)
            base_ctx.update({
                "project_cost": canonical.get("project_cost", {}).get("total"),
                "promoter_category": canonical.get("promoter", {}).get("category"),
                "active_schemes": schemes
            })
        else:
            base_ctx.update({"canonical": canonical})

        return base_ctx
