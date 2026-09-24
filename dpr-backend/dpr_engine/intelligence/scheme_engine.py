from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models.database_models import DPRSchemeRuleDB
from dpr_engine.intelligence.mudra_rules import MudraRulesEngine

class SchemeKnowledgeEngine:
    """
    Evaluates project data against versioned government scheme rules (PMMY/MUDRA, PMEGP, Stand-Up India).
    Generates structured rationale without legally binding guarantees.
    """

    @classmethod
    def evaluate_project_schemes(cls, canonical_data: Dict[str, Any], db: Session) -> List[Dict[str, Any]]:
        cost = canonical_data.get("project_cost", {}).get("total", 0.0)
        loan_amount = canonical_data.get("financing", {}).get("requested_loan", 0.0) or cost * 0.8
        sector_id = canonical_data.get("classification", {}).get("sector_id", "manufacturing")
        activity_id = canonical_data.get("classification", {}).get("activity_id", "")
        category = canonical_data.get("promoter", {}).get("category", "General")
        is_direct_crop = canonical_data.get("classification", {}).get("is_direct_crop", False)
        prev_tarun = canonical_data.get("financing", {}).get("previous_tarun_repaid", False)

        matched_schemes = []

        # 1. Evaluate PMMY / MUDRA Scheme Rule (Shishu, Kishore, Tarun, Tarun Plus)
        is_agri_eligible, status_code, msg = MudraRulesEngine.evaluate_sector_eligibility(activity_id, is_direct_crop)
        category_info = MudraRulesEngine.derive_mudra_category(loan_amount, prev_tarun)

        if not is_agri_eligible:
            matched_schemes.append({
                "scheme_id": "pmmy_mudra_v2026.1",
                "scheme_name": "Pradhan Mantri MUDRA Yojana (PMMY)",
                "authority": "MUDRA / SIDBI / Ministry of Finance",
                "version": "2026.1",
                "status": "NOT_APPLICABLE",
                "rationale": msg,
                "source_url": "https://www.mudra.org.in"
            })
        elif category_info["eligible"]:
            matched_schemes.append({
                "scheme_id": f"pmmy_mudra_{category_info['category'].lower()}_v2026.1",
                "scheme_name": f"Pradhan Mantri MUDRA Yojana — {category_info['label']}",
                "authority": "MUDRA / SIDBI / Participating Banks & MFI",
                "version": "2026.1",
                "status": "POTENTIALLY_APPLICABLE",
                "category_code": category_info["category"],
                "depth_level": category_info["depth"],
                "page_guideline": category_info["page_count_guideline"],
                "estimated_benefit": f"Collateral-free credit up to ₹{loan_amount:,.2f} under {category_info['label']} category.",
                "rationale": category_info["description"],
                "required_documents": ["UDYAM Registration Certificate", "Applicant PAN & Aadhaar", "Proforma Invoices / Vendor Quotations", "Bank Account Statement (6 Months)"],
                "source_url": "https://www.mudra.org.in",
                "last_verified_at": "2026-09-21"
            })
        else:
            matched_schemes.append({
                "scheme_id": "pmmy_mudra_v2026.1",
                "scheme_name": "Pradhan Mantri MUDRA Yojana (PMMY)",
                "authority": "MUDRA / SIDBI",
                "version": "2026.1",
                "status": "REQUIRES_OVERRIDE" if category_info.get("requires_override") else "NOT_APPLICABLE",
                "rationale": category_info.get("warning") or category_info.get("error", "Not eligible under current limits."),
                "source_url": "https://www.mudra.org.in"
            })

        # 2. Evaluate PMEGP Scheme Rule
        if cost <= 5000000.0:
            subsidy_pct = 35 if category in ["SC/ST", "OBC", "Women", "Ex-Serviceman"] else 25
            max_subsidy = cost * (subsidy_pct / 100.0)
            matched_schemes.append({
                "scheme_id": "pmegp_scheme_v1.0",
                "scheme_name": "Prime Minister Employment Generation Programme (PMEGP)",
                "authority": "KVIC / Ministry of MSME",
                "version": "1.0.0",
                "status": "POTENTIALLY_APPLICABLE",
                "estimated_benefit": f"{subsidy_pct}% Capital Subsidy (Est. ₹{max_subsidy:,.2f})",
                "rationale": f"Project cost (₹{cost:,.2f}) is within PMEGP threshold of ₹50 Lakhs for {sector_id.title()} units.",
                "required_documents": ["UDYAM Certificate", "Promoter Caste/Category Certificate", "EDI Training Certificate"],
                "source_url": "https://www.kviconline.gov.in/pmegpeportal",
                "last_verified_at": "2026-08-25"
            })
        else:
            matched_schemes.append({
                "scheme_id": "pmegp_scheme_v1.0",
                "scheme_name": "Prime Minister Employment Generation Programme (PMEGP)",
                "authority": "KVIC / Ministry of MSME",
                "version": "1.0.0",
                "status": "NOT_APPLICABLE",
                "rationale": f"Project cost (₹{cost:,.2f}) exceeds PMEGP ceiling limit of ₹50 Lakhs.",
                "source_url": "https://www.kviconline.gov.in/pmegpeportal"
            })

        # 3. Evaluate Stand-Up India Scheme Rule
        if category in ["SC/ST", "Women"]:
            matched_schemes.append({
                "scheme_id": "standup_india_v1.0",
                "scheme_name": "Stand-Up India Scheme for SC/ST & Women",
                "authority": "SIDBI / Ministry of Finance",
                "version": "1.0.0",
                "status": "POTENTIALLY_APPLICABLE",
                "estimated_benefit": "Composite bank loan from ₹10 Lakhs to ₹1 Crore with concessional margin money.",
                "rationale": f"Promoter category '{category}' is eligible for Stand-Up India greenfield venture credit.",
                "required_documents": ["Greenfield Unit Undertaking", "Bank Credit Application", "Project Plan"],
                "source_url": "https://www.standupmitra.in",
                "last_verified_at": "2026-08-25"
            })

        return matched_schemes

