from typing import Dict, Any, List
from sqlalchemy.orm import Session
from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver

class DPRContentPlanner:
    """
    Plans DPR content structure, section ordering, dependencies, and target document depth based on Blueprint.
    """

    @classmethod
    def determine_target_depth(cls, dpr_type: str, project_cost: float, scale: str) -> str:
        if project_cost >= 50000000.0 or scale == "large":
            return "COMPREHENSIVE"  # 65-80 pgs
        elif project_cost >= 15000000.0 or scale == "medium":
            return "DETAILED"       # 50-65 pgs
        elif project_cost >= 5000000.0:
            return "STANDARD"       # 30-50 pgs
        else:
            return "MINIMUM"        # 20-30 pgs

    @classmethod
    def create_content_plan(
        cls,
        dpr_type: str,
        sector_id: str,
        activity_id: str,
        project_cost: float,
        project_scale: str,
        db: Session
    ) -> Dict[str, Any]:
        # 1. Resolve Blueprint dynamically
        resolved_bp = DynamicBlueprintResolver.resolve_blueprint(
            dpr_type=dpr_type, sector_id=sector_id, activity_id=activity_id, db=db
        )

        bp_dict = resolved_bp.get("blueprint", resolved_bp)
        raw_secs = bp_dict.get("sections") or bp_dict.get("sections_json")
        if not raw_secs:
            if "Govt" in dpr_type or "Subsidy" in dpr_type:
                sections = [
                    {"id": "sec_exec", "name": "Executive Summary"},
                    {"id": "sec_scheme", "name": "Govt Subsidy Scheme Eligibility & Guidelines"},
                    {"id": "sec_promoter", "name": "Promoter Identity & Social Category"},
                    {"id": "sec_unit", "name": "Unit Location & Employment Potential"},
                    {"id": "sec_cost", "name": "Project Cost & Subsidy Calculation"},
                    {"id": "sec_financials", "name": "5-Year Financial Viability"}
                ]
            elif "Investor" in dpr_type or "Pitch" in dpr_type:
                sections = [
                    {"id": "sec_exec", "name": "Executive Summary"},
                    {"id": "sec_business", "name": "Company Overview & Product Solution"},
                    {"id": "sec_market", "name": "Market Opportunity & TAM/SAM/SOM"},
                    {"id": "sec_model", "name": "Business & Revenue Model"},
                    {"id": "sec_cost", "name": "Funding Requirement & Use of Funds"},
                    {"id": "sec_financials", "name": "Financial Projections & Unit Economics"}
                ]
            else:
                sections = [
                    {"id": "sec_exec", "name": "Executive Summary"},
                    {"id": "sec_promoter", "name": "Promoter & Entity Background"},
                    {"id": "sec_business", "name": "Business & Technical Feasibility"},
                    {"id": "sec_market", "name": "Market Demand & Industry Overview"},
                    {"id": "sec_cost", "name": "Project Cost & Means of Finance"},
                    {"id": "sec_financials", "name": "5-Year Financial Statements & Ratios"}
                ]
        else:
            sections = raw_secs
        depth = cls.determine_target_depth(dpr_type, project_cost, project_scale)

        planned_sections = []
        for i, s in enumerate(sections):
            key = s.get("key") or s.get("id") or f"sec_{i+1}"
            title = s.get("title") or s.get("name") or f"Section {i+1}"
            
            # Define section dependencies
            deps = []
            if key == "sec_exec":
                deps = ["sec_business", "sec_market", "sec_financials"]
            elif key == "sec_financials":
                deps = ["sec_cost"]

            planned_sections.append({
                "section_key": key,
                "title": title,
                "display_order": i + 1,
                "dependencies": deps,
                "required_blocks": ["HEADING", "PARAGRAPH", "METRIC"],
                "status": "NOT_STARTED"
            })

        return {
            "blueprint_id": resolved_bp.get("blueprint_id") or bp_dict.get("id") or f"blueprint_{dpr_type.lower().replace(' ', '_')}",
            "blueprint_version": resolved_bp.get("version") or bp_dict.get("version", "1.0.0"),
            "dpr_type": dpr_type,
            "target_depth": depth,
            "estimated_page_target": "30-50 pages" if depth == "STANDARD" else "50-65 pages",
            "sections": planned_sections,
            "total_sections": len(planned_sections)
        }
