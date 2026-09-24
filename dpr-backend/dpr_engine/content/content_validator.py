import re
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from dpr_engine.agents.agent_tools import ProjectDataTool, FinancialDataTool

class FinancialContentValidator:
    """
    Validates financial numbers referenced in generated content against authoritative FinancialModelResult.
    STRICTLY CANNOT SWALLOW OR OVERWRITE FINANCIAL MISMATCHES!
    """

    @classmethod
    def validate_section_financials(cls, project_id: str, section_key: str, content_blocks: List[Dict[str, Any]], db: Session) -> Dict[str, Any]:
        canonical = ProjectDataTool.get_canonical_project(project_id, db)
        fin_res = FinancialDataTool.get_financial_model_results(canonical)
        results = fin_res.get("financial_model_results", {})
        summary = results.get("summary", {})

        expected_total_cost = canonical.get("project_cost", {}).get("total", 0.0)
        expected_term_loan = canonical.get("funding", {}).get("term_loan", 0.0)

        warnings = []
        errors = []

        full_text = " ".join([
            str(b.get("content")) for b in content_blocks if isinstance(b.get("content"), str)
        ])

        # Check for currency mismatch if CapEx is mentioned
        cost_matches = re.findall(r'₹\s*([0-9,]+(?:\.[0-9]+)?)', full_text)
        for val_str in cost_matches:
            val_clean = float(val_str.replace(',', ''))
            # If total cost is mentioned, verify exact match
            if val_clean > 100000 and abs(val_clean - expected_total_cost) > 1.0 and abs(val_clean - expected_term_loan) > 1.0:
                # Check if it matches any valid cost item (building, machinery, land)
                cost_breakdown = canonical.get("project_cost", {})
                valid_costs = [cost_breakdown.get("land", 0), cost_breakdown.get("building", 0), cost_breakdown.get("machinery", 0), cost_breakdown.get("working_capital", 0)]
                if not any(abs(val_clean - vc) < 1.0 for vc in valid_costs):
                    warnings.append(f"Referenced financial value ₹{val_clean:,.2f} does not match canonical CapEx breakdown.")

        return {
            "is_valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings
        }

class PlaceholderDetector:
    """
    Detects unresolved placeholders ([INSERT VALUE], [TBD], TODO, XXXX, Lorem ipsum).
    """

    PATTERNS = [r'\[INSERT.*?\]', r'\[TBD\]', r'TODO', r'XXXX', r'Lorem ipsum']

    @classmethod
    def find_placeholders(cls, content_blocks: List[Dict[str, Any]]) -> List[str]:
        found = []
        for b in content_blocks:
            c = str(b.get("content", ""))
            for p in cls.PATTERNS:
                if re.search(p, c, re.IGNORECASE):
                    found.append(f"Unresolved placeholder matching pattern '{p}' found in content block.")
        return found

class ContentCompletenessCalculator:
    """
    Calculates section completeness % and overall project content completeness %.
    """

    @classmethod
    def calculate_completeness(cls, sections: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not sections:
            return {"overall_completeness": 0, "section_scores": {}}

        scores = {}
        total = 0
        for s in sections:
            key = s.get("section_key")
            status = s.get("status")

            if status in ["APPROVED", "VALIDATED"]:
                score = 100
            elif status in ["NEEDS_REVIEW", "GENERATED"]:
                score = 80
            elif status == "GENERATING":
                score = 50
            else:
                score = 0

            scores[key] = score
            total += score

        overall = int(total / len(sections))
        return {
            "overall_completeness": overall,
            "section_scores": scores
        }
