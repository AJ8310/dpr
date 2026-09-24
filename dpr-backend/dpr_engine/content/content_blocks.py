from typing import Dict, Any, List, Optional

class ContentBlockBuilder:
    """
    Constructs structured content blocks, tables, and chart references with provenance tracking.
    """

    @staticmethod
    def create_heading(text: str, level: int = 2) -> Dict[str, Any]:
        return {
            "type": "HEADING" if level == 2 else "SUBHEADING",
            "content": text,
            "level": level,
            "provenance": "SYSTEM_CALCULATED"
        }

    @staticmethod
    def create_paragraph(text: str, provenance: str = "AI_INFERENCE", sources: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        return {
            "type": "PARAGRAPH",
            "content": text,
            "provenance": provenance,
            "source_references": sources or []
        }

    @staticmethod
    def create_bullet_list(items: List[str], provenance: str = "AI_INFERENCE") -> Dict[str, Any]:
        return {
            "type": "BULLET_LIST",
            "content": items,
            "provenance": provenance
        }

    @staticmethod
    def create_callout(text: str, callout_type: str = "INFO") -> Dict[str, Any]:
        return {
            "type": "CALLOUT",
            "content": text,
            "callout_type": callout_type,
            "provenance": "SYSTEM_CALCULATED"
        }

    @staticmethod
    def create_structured_table(table_id: str, title: str, columns: List[str], rows: List[List[Any]]) -> Dict[str, Any]:
        return {
            "table_id": table_id,
            "title": title,
            "columns": columns,
            "rows": rows,
            "source": "SYSTEM_CALCULATED_DATA"
        }

    @staticmethod
    def create_chart_reference(chart_id: str, title: str, dataset_key: str) -> Dict[str, Any]:
        return {
            "chart_id": chart_id,
            "title": title,
            "dataset_reference": dataset_key,
            "placement_hint": "AFTER_FINANCIAL_TABLE"
        }
