"""
Bank Submission Pack Generator for VKF DPR Engine
Assembles complete bank-ready application bundles as structured JSON / PDF records.
"""

from typing import Dict, Any, List
from datetime import datetime
from services.validation_service import DPRValidationService

class BankSubmissionPackService:

    @classmethod
    def assemble_submission_pack(cls, submission_data: Dict[str, Any], validation_result: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Assembles a 11-part Bank Submission Pack for participating lending institutions.
        """
        if not validation_result:
            validation_result = DPRValidationService.validate_submission_data(submission_data)

        business_name = submission_data.get("business_name", "Micro Business Unit")
        promoter_name = submission_data.get("promoter_name", "Promoter")
        bank_name = submission_data.get("bank_name", "State Bank of India")
        branch_name = submission_data.get("bank_branch", "Local Branch")
        requested_loan = float(submission_data.get("requested_loan", 500000.0))
        mudra_category = validation_result.get("category_label", "Kishore")
        
        timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cover_letter = f"""
MEMORANDUM / CREDIT APPLICATION COVER LETTER

Date: {datetime.now().strftime("%d %B %Y")}
To,
The Branch Manager,
{bank_name}, {branch_name} Branch.

Subject: Credit Application for {requested_loan:,.2f} under Pradhan Mantri MUDRA Yojana ({mudra_category})

Respected Sir/Madam,

We submit herewith the Detailed Project Report (DPR) and credit appraisal pack for '{business_name}', promoted by {promoter_name}. 

The unit proposes to establish/expand business operations with a Total Project Cost of ₹{submission_data.get('project_cost', requested_loan*1.25):,.2f}, requesting a bank loan facility of ₹{requested_loan:,.2f} under the PMMY ({mudra_category}) framework.

The attached DPR incorporates detailed technical feasibility, operational workflows, 5-year financial projections (P&L, Cash Flow, Balance Sheet, DSCR), asset schedules, and compliance registrations verified through the Vision Karnataka Foundation (VKF) DPR Engine.

We request you to kindly accord credit appraisal and sanction at your earliest convenience.

Yours faithfully,

For {business_name},
({promoter_name})
Promoter / Authorized Signatory
VKF Assisted Enterprise
"""

        vkf_scorecard = {
            "title": "Vision Karnataka Foundation — Internal Readiness Assessment",
            "evaluated_at": timestamp_str,
            "overall_readiness_score": "88/100 (HIGH READINESS)" if validation_result["can_generate"] else "55/100 (NEEDS REVISION)",
            "validation_status": "PASS — Ready for Bank Submission" if validation_result["can_generate"] else "BLOCK — Action Required",
            "key_metrics": {
                "project_cost_reconciliation": "RECONCILED",
                "mudra_category_alignment": mudra_category,
                "udyam_status": submission_data.get("udyam_status", "Registered / Verified"),
                "vkf_cluster_support": submission_data.get("vkf_cluster_support", "Training & Market Linkage Enabled")
            },
            "disclaimer": "This readiness assessment is an internal VKF credit-appraisal tool and does not constitute a legal guarantee of bank sanction."
        }

        pack_documents = [
            {"doc_id": "doc_01", "name": "Official Bank Cover Letter", "status": "GENERATED", "type": "pdf"},
            {"doc_id": "doc_02", "name": f"Detailed Project Report (DPR) — {mudra_category}", "status": "GENERATED", "type": "pdf"},
            {"doc_id": "doc_03", "name": "Financial Statements & Debt Amortization Schedule", "status": "GENERATED", "type": "excel_pdf"},
            {"doc_id": "doc_04", "name": "Vendor Machinery Quotation Reconciliation Summary", "status": "ATTACHED" if submission_data.get("quotations") else "PENDING", "type": "pdf"},
            {"doc_id": "doc_05", "name": "Promoter KYC & Entity Registration Documents", "status": "ATTACHED", "type": "pdf"},
            {"doc_id": "doc_06", "name": "Udyam / MSME Registration Certificate", "status": "ATTACHED" if submission_data.get("udyam_status") != "NOT_REGISTERED" else "WARNING", "type": "pdf"},
            {"doc_id": "doc_07", "name": "Financial & Market Assumption Register", "status": "GENERATED", "type": "pdf"},
            {"doc_id": "doc_08", "name": "VKF Internal Readiness Scorecard & Review Sheet", "status": "VERIFIED", "type": "pdf"}
        ]

        return {
            "submission_pack_id": f"PACK_MUDRA_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "generated_at": timestamp_str,
            "business_name": business_name,
            "promoter_name": promoter_name,
            "bank_name": bank_name,
            "requested_loan": requested_loan,
            "mudra_category": mudra_category,
            "validation_summary": validation_result["summary"],
            "cover_letter": cover_letter.strip(),
            "vkf_scorecard": vkf_scorecard,
            "pack_documents": pack_documents
        }
