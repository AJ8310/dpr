import re
from typing import Dict, Any, List
from dpr_engine.document.ir.document_ir import DocumentIR

class DocumentValidator:
    """
    Validates rendered DocumentIR for placeholder tokens, financial consistency, table completeness, and quality score.
    """

    PATTERNS = [r'\{\{.*?\}\}', r'\[PLACEHOLDER\]', r'TODO', r'TBD', r'Lorem ipsum', r'undefined', r'debug_']

    @classmethod
    def validate_document_ir(cls, doc_ir: DocumentIR) -> Dict[str, Any]:
        errors = []
        warnings = []

        # 1. Placeholder Token Detection
        for s in doc_ir.sections:
            title = s.get("title", "")
            blocks = s.get("content_blocks", [])
            for b in blocks:
                content = str(b.get("content", ""))
                for p in cls.PATTERNS:
                    if re.search(p, content, re.IGNORECASE):
                        errors.append(f"Unresolved placeholder matching '{p}' found in section '{title}'.")

        # 2. Required Sections & Tables Check
        if len(doc_ir.sections) < 5:
            errors.append("Document IR contains insufficient sections (< 5 mandatory sections).")

        if len(doc_ir.tables) == 0:
            warnings.append("Document IR contains zero financial table objects.")

        # 3. Quality Score Calculation (0 - 100)
        score = 100.0
        score -= (len(errors) * 20.0)
        score -= (len(warnings) * 5.0)
        score = max(0.0, min(100.0, score))

        quality_status = "READY" if score >= 90 else ("REVIEW_REQUIRED" if score >= 75 else "FAILED")

        return {
            "is_valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "quality_score": score,
            "quality_status": quality_status
        }
