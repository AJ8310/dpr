"""
PMMY / MUDRA Scheme Rule Architecture & Configuration
Implements 5-Layer Rule Engine parameters and versioned guidelines for Vision Karnataka Foundation (VKF).
"""

from typing import Dict, Any, List, Tuple, Optional

# Versioning metadata
MUDRA_SCHEME_VERSION = "2026.1"
LAST_VERIFIED_DATE = "2026-09-21"

# Loan Category Thresholds (in INR)
SHISHU_MAX_LOAN = 50000.0
KISHORE_MAX_LOAN = 500000.0
TARUN_MAX_LOAN = 1000000.0
TARUN_PLUS_MAX_LOAN = 2000000.0

# Supported Applicant Structures
APPLICANT_STRUCTURES = {
    "INDIVIDUAL": "Individual Entrepreneur",
    "PROPRIETORSHIP": "Sole Proprietorship Enterprise",
    "PARTNERSHIP": "Partnership Firm",
    "LLP": "Limited Liability Partnership",
    "SHG": "Self Help Group (SHG)",
    "JLG": "Joint Liability Group (JLG)",
    "FPO": "Farmer Producer Organization / Company (FPO/FPC)"
}

# Direct Agriculture vs Agri-Allied Activity Classification
EXCLUDED_DIRECT_AGRI_ACTIVITIES = [
    "crop_cultivation", "land_purchase", "crop_inputs", "paddy_growing", "wheat_growing", "sugarcane_farming"
]

ELIGIBLE_AGRI_ALLIED_ACTIVITIES = [
    "dairy_processing", "poultry_farming", "fisheries", "beekeeping", "sericulture",
    "spice_processing", "agro_processing", "food_processing", "packaging", "aggregation_hub"
]

class MudraRulesEngine:

    @staticmethod
    def derive_mudra_category(loan_amount: float, previous_tarun_history: bool = False) -> Dict[str, Any]:
        """
        Derives PMMY/MUDRA loan category based strictly on requested loan amount and prior repayment history.
        """
        if loan_amount <= 0:
            return {
                "category": "INVALID",
                "label": "Invalid Amount",
                "depth": "none",
                "page_count_guideline": "N/A",
                "eligible": False,
                "error": "Loan amount must be greater than zero."
            }
        
        if loan_amount <= SHISHU_MAX_LOAN:
            return {
                "category": "SHISHU",
                "label": "Shishu (Up to ₹50,000)",
                "depth": "simplified",
                "page_count_guideline": "1–3 Pages",
                "eligible": True,
                "description": "Very small / initial business requirements. Simplified cash flow tracker."
            }
        elif loan_amount <= KISHORE_MAX_LOAN:
            return {
                "category": "KISHORE",
                "label": "Kishore (₹50,001 to ₹5 Lakhs)",
                "depth": "moderate",
                "page_count_guideline": "5–10 Pages",
                "eligible": True,
                "description": "Growing micro-enterprises. Requires 2-year projected P&L and Balance Sheet."
            }
        elif loan_amount <= TARUN_MAX_LOAN:
            return {
                "category": "TARUN",
                "label": "Tarun (₹5 Lakhs to ₹10 Lakhs)",
                "depth": "full",
                "page_count_guideline": "10–20+ Pages",
                "eligible": True,
                "description": "Expansion / scaling. Full techno-economic report with 3-5 year DSCR & BEP analysis."
            }
        elif loan_amount <= TARUN_PLUS_MAX_LOAN:
            if previous_tarun_history:
                return {
                    "category": "TARUN_PLUS",
                    "label": "Tarun Plus (₹10 Lakhs to ₹20 Lakhs)",
                    "depth": "enterprise",
                    "page_count_guideline": "Full Techno-Economic + Prior Audit",
                    "eligible": True,
                    "description": "Scalable Tarun expansion for borrowers with verified previous Tarun loan closure."
                }
            else:
                return {
                    "category": "TARUN_PLUS",
                    "label": "Tarun Plus Candidate (₹10 Lakhs to ₹20 Lakhs)",
                    "depth": "enterprise",
                    "page_count_guideline": "Full Techno-Economic + Prior Audit",
                    "eligible": False,
                    "requires_override": True,
                    "warning": "Tarun Plus (>₹10 Lakhs) requires evidence of previously availed and successfully repaid Tarun loan."
                }
        else:
            return {
                "category": "EXCEEDED",
                "label": "Exceeds MUDRA Ceiling (>₹20 Lakhs)",
                "depth": "commercial",
                "page_count_guideline": "Commercial Bank DPR",
                "eligible": False,
                "error": f"Requested loan ₹{loan_amount:,.2f} exceeds MUDRA maximum ceiling of ₹20 Lakhs. Alternate commercial term loan required."
            }

    @staticmethod
    def evaluate_sector_eligibility(activity_id: str, is_direct_crop_cultivation: bool) -> Tuple[bool, str, str]:
        """
        Evaluates Layer 1 Sector & Activity Eligibility.
        Returns: (is_eligible, status_code, message)
        """
        if is_direct_crop_cultivation or activity_id in EXCLUDED_DIRECT_AGRI_ACTIVITIES:
            return (
                False,
                "NOT_ELIGIBLE_DIRECT_CROP",
                "Direct crop cultivation and agricultural land purchase are excluded from PMMY micro-business credit. Allied agricultural or food processing activities are eligible."
            )
        return (
            True,
            "ELIGIBLE",
            "Business activity qualifies for PMMY micro-enterprise credit framework."
        )

    @staticmethod
    def validate_project_cost_reconciliation(project_cost: float, promoter_contribution: float, term_loan: float, wc_loan: float, subsidy: float = 0.0) -> Dict[str, Any]:
        """
        Hard Rule: Total Project Cost MUST EQUAL Own Contribution + Term Loan + Working Capital Loan + Subsidy.
        """
        total_sources = promoter_contribution + term_loan + wc_loan + subsidy
        diff = abs(project_cost - total_sources)
        is_balanced = diff < 1.0  # Float tolerance

        return {
            "is_balanced": is_balanced,
            "project_cost": project_cost,
            "total_sources": total_sources,
            "difference": diff,
            "message": "Project cost reconciles perfectly with means of finance." if is_balanced else f"Project cost (₹{project_cost:,.2f}) does not match Total Sources of Funds (₹{total_sources:,.2f}). Difference: ₹{diff:,.2f}."
        }
