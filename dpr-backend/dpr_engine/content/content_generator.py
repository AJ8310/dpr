import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from models.database_models import DPRProjectDB, DPRContentPackageDB, DPRContentSectionDB
from dpr_engine.content.content_planner import DPRContentPlanner
from dpr_engine.content.context_builder import SectionContextBuilder
from dpr_engine.content.prompt_templates import PromptTemplateEngine
from dpr_engine.content.content_blocks import ContentBlockBuilder
from dpr_engine.content.content_validator import (
    FinancialContentValidator, PlaceholderDetector, ContentCompletenessCalculator
)
from dpr_engine.agents.llm_provider import get_llm_provider, PromptSanitizer

class DPRContentGenerator:
    """
    Section-by-section DPR Content Generator with single-section regeneration and human approval workflows.
    """

    @classmethod
    def initialize_content_package(cls, project_id: str, db: Session) -> DPRContentPackageDB:
        project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
        if not project:
            raise ValueError(f"DPR Project '{project_id}' not found.")

        # Check existing package
        package = db.query(DPRContentPackageDB).filter(DPRContentPackageDB.project_id == project_id).first()
        cost = project.form_data_json.get("total_cost", 25000000.0) if project.form_data_json else 25000000.0

        plan = DPRContentPlanner.create_content_plan(
            dpr_type=project.dpr_type,
            sector_id=project.sector_id,
            activity_id=project.activity_id,
            project_cost=cost,
            project_scale=project.project_scale,
            db=db
        )

        if not package:
            package = DPRContentPackageDB(
                project_id=project_id,
                dpr_type=project.dpr_type,
                blueprint_id=plan["blueprint_id"],
                blueprint_version=plan["blueprint_version"],
                target_depth=plan["target_depth"],
                overall_completeness=0
            )
            db.add(package)
            db.commit()
            db.refresh(package)

        # Initialize sections if empty
        existing_sec_count = db.query(DPRContentSectionDB).filter(DPRContentSectionDB.package_id == package.id).count()
        if existing_sec_count == 0:
            for s in plan["sections"]:
                sec_db = DPRContentSectionDB(
                    package_id=package.id,
                    project_id=project_id,
                    section_key=s["section_key"],
                    title=s["title"],
                    display_order=s["display_order"],
                    status="NOT_STARTED"
                )
                db.add(sec_db)
            db.commit()

        return package

    @classmethod
    def generate_section_content(cls, project_id: str, section_key: str, user_feedback: Optional[str], db: Session) -> Dict[str, Any]:
        sec_db = db.query(DPRContentSectionDB).filter(
            DPRContentSectionDB.project_id == project_id,
            DPRContentSectionDB.section_key == section_key
        ).first()

        if not sec_db:
            raise ValueError(f"Section '{section_key}' not found for project '{project_id}'.")

        sec_db.status = "GENERATING"
        db.commit()

        # 1. Build Minimal Context & Fetch Prompt Template
        ctx = SectionContextBuilder.build_context(section_key, project_id, db)
        project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
        tpl = PromptTemplateEngine.get_template(section_key, project.dpr_type, db)

        # 2. Invoke LLM Provider
        llm = get_llm_provider()
        prompt_text = f"Generate narrative for {sec_db.title}. Context: {ctx}"
        if user_feedback:
            prompt_text += f"\nUser Revision Request: {PromptSanitizer.sanitize_untrusted_input(user_feedback)}"

        gen_out = llm.structured_generate(prompt_text, {}, tpl["system_instruction"])

        # 3. Construct Structured Blocks, Tables & Charts
        b1 = ContentBlockBuilder.create_heading(sec_db.title, level=2)
        narrative = gen_out.get("findings", [{}])[0].get("content", f"Detailed narrative for {sec_db.title} explaining technical and commercial viability.")
        b2 = ContentBlockBuilder.create_paragraph(narrative, provenance="AI_INFERENCE")

        blocks = [b1, b2]
        tables = []
        charts = []

        if section_key in ["sec_exec", "sec_cost"]:
            # Cost Table
            cost = ctx.get("project_cost", {}).get("total", 25000000.0) if isinstance(ctx.get("project_cost"), dict) else 25000000.0
            equity = cost * 0.25
            loan = cost * 0.75
            t1 = ContentBlockBuilder.create_structured_table(
                "tbl_cost", "Project Cost & Means of Finance Summary",
                ["Component", "Amount (₹)", "Percentage (%)"],
                [["Total Capital Expenditure", f"{cost:,.2f}", "100.0%"], ["Promoter Equity Contribution", f"{equity:,.2f}", "25.0%"], ["Bank Term Loan", f"{loan:,.2f}", "75.0%"]]
            )
            tables.append(t1)
            charts.append(ContentBlockBuilder.create_chart_reference("chart_rev", "5-Year Revenue Trend", "revenue_chart"))

        # 4. Content Validation
        fin_val = FinancialContentValidator.validate_section_financials(project_id, section_key, blocks, db)
        placeholders = PlaceholderDetector.find_placeholders(blocks)

        sec_db.content_blocks_json = blocks
        sec_db.tables_json = tables
        sec_db.chart_references_json = charts
        sec_db.warnings_json = fin_val["warnings"] + placeholders
        sec_db.status = "NEEDS_REVIEW"
        sec_db.approval_status = "PENDING_APPROVAL" if section_key in ["sec_exec", "sec_financials"] else "NOT_REQUIRED"
        if user_feedback:
            sec_db.user_feedback = user_feedback
        db.commit()

        # Update package completeness
        all_secs = db.query(DPRContentSectionDB).filter(DPRContentSectionDB.project_id == project_id).all()
        sec_dicts = [{"section_key": s.section_key, "status": s.status} for s in all_secs]
        comp_res = ContentCompletenessCalculator.calculate_completeness(sec_dicts)

        pkg = db.query(DPRContentPackageDB).filter(DPRContentPackageDB.project_id == project_id).first()
        if pkg:
            pkg.overall_completeness = comp_res["overall_completeness"]
            db.commit()

        return {
            "success": True,
            "section_key": section_key,
            "status": sec_db.status,
            "content_blocks": blocks,
            "tables": tables,
            "charts": charts,
            "warnings": sec_db.warnings_json
        }
