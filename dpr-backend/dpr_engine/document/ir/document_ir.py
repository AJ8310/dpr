from typing import Dict, Any, List, Optional
import datetime

class DocumentIR:
    """
    Single canonical Document Intermediate Representation (Document IR)
    independent of target output format (DOCX, PDF, HTML).
    """

    def __init__(
        self,
        project_id: str,
        snapshot_id: str,
        dpr_type: str,
        title: str,
        metadata: Dict[str, Any],
        cover: Dict[str, Any],
        doc_control: Dict[str, Any],
        sections: List[Dict[str, Any]],
        tables: List[Dict[str, Any]],
        charts: List[Dict[str, Any]],
        references: List[Dict[str, Any]]
    ):
        self.project_id = project_id
        self.snapshot_id = snapshot_id
        self.dpr_type = dpr_type
        self.title = title
        self.metadata = metadata
        self.cover = cover
        self.doc_control = doc_control
        self.sections = sections
        self.tables = tables
        self.charts = charts
        self.references = references
        self.created_at = datetime.datetime.now().isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "project_id": self.project_id,
            "snapshot_id": self.snapshot_id,
            "dpr_type": self.dpr_type,
            "title": self.title,
            "metadata": self.metadata,
            "cover": self.cover,
            "doc_control": self.doc_control,
            "sections": self.sections,
            "tables": self.tables,
            "charts": self.charts,
            "references": self.references,
            "created_at": self.created_at
        }
