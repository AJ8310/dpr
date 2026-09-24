"""
3-Tier Validation Engine for PMMY / MUDRA DPR Engine
Implements HARD BLOCK, WARNING, and INFORMATION validation tiers.
"""

from typing import Dict, Any, List
from dpr_engine.intelligence.mudra_rules import MudraRulesEngine

class DPRValidationService:

    @classmethod
    def validate_submission_data(cls, submission_data: Dict[str, Any]) -> Dict[str, Any]:
        hard_blocks = []
        warnings = []
        info_hints = []

        # Extract values safely
        project_cost = float(submission_data.get("project_cost", 0.0))
        requested_loan = float(submission_data.get("requested_loan", 0.0))
        promoter_contribution = float(submission_data.get("promoter_contribution", 0.0))
        term_loan = float(submission_data.get("term_loan", 0.0))
        wc_loan = float(submission_data.get("working_capital_loan", 0.0))
        subsidy = float(submission_data.get("subsidy_amount", 0.0))
        
        activity_id = submission_data.get("activity_id", "")
        is_direct_crop = submission_data.get("is_direct_crop", False)
        prev_tarun_repaid = submission_data.get("previous_tarun_repaid", False)
        udyam_status = submission_data.get("udyam_status", "NOT_REGISTERED")
        projected_sales_growth = float(submission_data.get("projected_sales_growth_pct", 15.0))
        quotations = submission_data.get("quotations", [])

        # --- 1. LAYER 1 & 2: SECTOR & MUDRA CATEGORY VALIDATION ---
        is_agri_eligible, status_code, agri_msg = MudraRulesEngine.evaluate_sector_eligibility(activity_id, is_direct_crop)
        if not is_agri_eligible:
            hard_blocks.append({
                "code": "EXCLUDED_DIRECT_AGRICULTURE",
                "field": "is_direct_crop",
                "message": agri_msg
            })

        category_eval = MudraRulesEngine.derive_mudra_category(requested_loan, prev_tarun_repaid)
        if not category_eval["eligible"]:
            if category_eval.get("requires_override"):
                warnings.append({
                    "code": "TARUN_PLUS_PREVIOUS_LOAN_REQUIRED",
                    "field": "requested_loan",
                    "message": category_eval["warning"],
                    "requires_acknowledgement": True
                })
            else:
                hard_blocks.append({
                    "code": "MUDRA_CEILING_EXCEEDED",
                    "field": "requested_loan",
                    "message": category_eval.get("error", "Loan amount exceeds MUDRA limits.")
                })

        # --- 2. LAYER 3: PROJECT COST RECONCILIATION ---
        # Default term_loan + wc_loan to requested_loan if split not provided
        if term_loan == 0.0 and wc_loan == 0.0:
            term_loan = requested_loan * 0.7
            wc_loan = requested_loan * 0.3

        reconcile = MudraRulesEngine.validate_project_cost_reconciliation(
            project_cost, promoter_contribution, term_loan, wc_loan, subsidy
        )
        if not reconcile["is_balanced"]:
            hard_blocks.append({
                "code": "PROJECT_COST_MISMATCH",
                "field": "project_cost",
                "message": reconcile["message"]
            })

        # --- 3. LAYER 4: FINANCIAL GROWTH & RATIOS ---
        if projected_sales_growth > 25.0:
            warnings.append({
                "code": "HIGH_REVENUE_GROWTH_WARNING",
                "field": "projected_sales_growth_pct",
                "message": f"Projected annual growth of {projected_sales_growth}% is high. Please provide market demand justification in the DPR assumptions.",
                "requires_acknowledgement": True
            })

        # --- 4. LAYER 5: DOCUMENT & QUOTATION VALIDATION ---
        if udyam_status == "NOT_REGISTERED":
            warnings.append({
                "code": "MISSING_UDYAM_REGISTRATION",
                "field": "udyam_status",
                "message": "Udyam registration is recommended for MSME & PMMY credit sanction. Resolve before bank submission.",
                "requires_acknowledgement": False
            })

        if len(quotations) == 0 and project_cost > 100000.0:
            info_hints.append({
                "code": "QUOTATION_RECOMMENDED",
                "field": "quotations",
                "message": "Uploading formal vendor quotations for machinery & fixed assets strengthens bank appraisal readiness."
            })

        can_generate = len(hard_blocks) == 0

        return {
            "can_generate": can_generate,
            "mudra_category": category_eval.get("category"),
            "category_label": category_eval.get("label"),
            "page_guideline": category_eval.get("page_count_guideline"),
            "hard_blocks": hard_blocks,
            "warnings": warnings,
            "info_hints": info_hints,
            "summary": f"{len(hard_blocks)} Hard Blocks · {len(warnings)} Warnings · {len(info_hints)} Info Hints"
        }
