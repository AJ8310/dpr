from typing import Dict, Any
from sqlalchemy.orm import Session
from models.database_models import DPRProjectDB, DPRContentPackageDB, DPRContentSectionDB, DPRContentSnapshotDB

class ContentSnapshotBuilder:
    """
    Freezes a project's generated content into an immutable DPRContentSnapshot for Phase 8 Document Assembly.
    """

    @classmethod
    def create_immutable_snapshot(cls, project_id: str, db: Session) -> Dict[str, Any]:
        project = db.query(DPRProjectDB).filter(DPRProjectDB.id == project_id).first()
        if not project:
            raise ValueError(f"DPR Project '{project_id}' not found.")

        package = db.query(DPRContentPackageDB).filter(DPRContentPackageDB.project_id == project_id).first()
        if not package:
            raise ValueError(f"No Content Package found for project '{project_id}'.")

        sections = db.query(DPRContentSectionDB).filter(DPRContentSectionDB.package_id == package.id).all()
        sec_snapshots = [
            {
                "section_key": s.section_key,
                "title": s.title,
                "display_order": s.display_order,
                "status": s.status,
                "content_blocks": s.content_blocks_json,
                "tables": s.tables_json,
                "chart_references": s.chart_references_json,
                "source_references": s.source_references_json,
                "approval_status": s.approval_status,
                "version": s.version
            }
            for s in sections
        ]

        snapshot = DPRContentSnapshotDB(
            project_id=project_id,
            package_id=package.id,
            snapshot_version="1.0.0",
            project_data_version="1.0.0",
            blueprint_version=package.blueprint_version,
            financial_model_version="1.0.0",
            research_version="1.0.0",
            scheme_version="1.0.0",
            sections_snapshot_json=sec_snapshots
        )
        db.add(snapshot)

        # Update project status
        project.status = "READY_FOR_REPORT_GENERATION"
        db.commit()
        db.refresh(snapshot)

        return {
            "success": True,
            "snapshot_id": snapshot.id,
            "project_id": project_id,
            "snapshot_version": snapshot.snapshot_version,
            "total_sections_frozen": len(sec_snapshots),
            "project_status": project.status
        }
