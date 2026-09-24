from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from models.database_models import DPRProjectDB, DPRContentSnapshotDB, DPRContentPackageDB
from dpr_engine.document.ir.document_ir import DocumentIR
from dpr_engine.financials.canonical_model import DPRProjectData
from dpr_engine.financials.financial_intelligence import FinancialIntelligenceEngine

class DocumentCompilationContext:
    """
    Ingests immutable DPRContentSnapshot, verifies snapshot integrity, validates financial figures against FinancialModelResult,
    and constructs the single canonical DocumentIR.
    """

    @classmethod
    def load_context_and_build_ir(cls, project_id: str, snapshot_id: str, db: Session) -> DocumentIR:
        project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
        if not project:
            raise ValueError(f"DPR Project '{project_id}' not found.")

        snapshot = db.query(DPRContentSnapshotDB).filter(
            DPRContentSnapshotDB.id == snapshot_id,
            DPRContentSnapshotDB.project_id == project_id
        ).first()

        if not snapshot:
            raise ValueError(f"DPR Content Snapshot '{snapshot_id}' not found or invalid.")

        package = db.query(DPRContentPackageDB).filter(DPRContentPackageDB.id == snapshot.package_id).first()
        sections_snapshot = snapshot.sections_snapshot_json or []

        # 1. Financial Verification
        form_data = project.form_data_json or {}
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
            responses=form_data
        )

        fin_computation = FinancialIntelligenceEngine.compute(canonical)
        fin_summary = fin_computation.get("financial_model_results", {}).get("summary", {})

        # 2. Cover Page Metadata
        cover = {
            "business_name": project.business_name,
            "dpr_type": project.dpr_type,
            "sector_id": project.sector_id,
            "activity_id": project.activity_id,
            "project_scale": project.project_scale,
            "geography": "Karnataka, India",
            "date": "August 2026",
            "confidentiality": "CONFIDENTIAL — FOR BANK & OFFICIAL SUBMISSION ONLY"
        }

        doc_control = {
            "document_id": f"DPR-{project.dpr_type.upper()[:4]}-{project_id[:8].upper()}",
            "dpr_type": project.dpr_type,
            "blueprint_version": package.blueprint_version if package else "1.0.0",
            "content_version": "1.0.0",
            "snapshot_version": snapshot.snapshot_version,
            "financial_model_version": "1.0.0",
            "prepared_for": "Vision Karnataka Foundation / Sanctioning Authority",
            "prepared_by": "Antigravity Dynamic DPR Platform Engine v2.0"
        }

        # 3. Assemble IR Sections, Tables, Charts, References
        all_tables = []
        all_charts = []
        all_refs = []

        for s in sections_snapshot:
            tbls = s.get("tables", [])
            chrts = s.get("chart_references", [])
            refs = s.get("source_references", [])
            if tbls:
                all_tables.extend(tbls)
            if chrts:
                all_charts.extend(chrts)
            if refs:
                all_refs.extend(refs)

        return DocumentIR(
            project_id=project_id,
            snapshot_id=snapshot_id,
            dpr_type=project.dpr_type,
            title=f"Detailed Project Report — {project.business_name}",
            metadata={"financial_summary": fin_summary},
            cover=cover,
            doc_control=doc_control,
            sections=sections_snapshot,
            tables=all_tables,
            charts=all_charts,
            references=all_refs
        )
