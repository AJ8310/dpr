from typing import List, Dict, Any
from dpr_engine.data_model import DPRDocumentModel

class QualityValidationEngine:

    @staticmethod
    def audit_document(doc: DPRDocumentModel) -> Dict[str, Any]:
        warnings: List[str] = []
        checks: Dict[str, bool] = {
            "business_info": True,
            "promoter_info": True,
            "project_cost": True,
            "funding_sources": True,
            "financial_projections": True,
            "financial_reconciliation": True,
            "loan_details": True,
            "market_info": True,
            "supporting_documents": True
        }

        # 1. Business Info Checks
        if not doc.business_name or doc.business_name == "Enterprise":
            checks["business_info"] = False
            warnings.append("Business name is set to default. Please specify exact entity name.")

        if not doc.gst_no and not doc.udyam_no:
            warnings.append("Neither GSTIN nor Udyam MSME number provided. Verification recommended.")

        # 2. Promoter Info Checks
        if len(doc.members) == 0:
            checks["promoter_info"] = False
            warnings.append("No promoter board members entered. Minimum 1 promoter required.")

        # 3. Project Cost & Funding Reconciliation
        if doc.total_cost <= 0:
            checks["project_cost"] = False
            warnings.append("Total project cost is zero or negative.")

        if abs(doc.total_cost - doc.total_funds) > 1000.0:
            checks["financial_reconciliation"] = False
            warnings.append(
                f"Financial Mismatch: Total Project Cost (₹{doc.total_cost:,.2f}) does not equal Total Means of Finance (₹{doc.total_funds:,.2f})."
            )

        # 4. Bank Loan Repayment Check
        if doc.bank_loan > 0 and doc.repayment_tenure_years <= 0:
            checks["loan_details"] = False
            warnings.append("Bank loan amount specified without valid repayment tenure.")

        # 5. DSCR Benchmark Warning
        if doc.avg_dscr < 1.25:
            warnings.append(f"Low DSCR Warning: Average 5-Year DSCR is {doc.avg_dscr}, below standard bank benchmark of 1.50.")

        # 6. Image / Supporting Media Check
        if not doc.logo_path and not doc.product_path:
            checks["supporting_documents"] = False
            warnings.append("No company logo or product photograph uploaded. Placeholder images will be used.")

        is_passed = len([c for c, val in checks.items() if not val]) == 0
        doc.validation_warnings = warnings

        return {
            "is_passed": is_passed,
            "checks": checks,
            "warnings": warnings,
            "warning_count": len(warnings),
            "score_percent": round(100.0 * (sum(checks.values()) / len(checks)), 1)
        }
