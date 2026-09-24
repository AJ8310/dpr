from typing import Dict, List, Any, Optional
from decimal import Decimal
import datetime

class DPRProjectData:
    """
    Canonical, deterministic internal representation of a DPR Project.
    Created by mapping validated question responses and blueprint configurations.
    """

    @classmethod
    def from_project_and_responses(
        cls,
        project_id: str,
        business_name: str,
        dpr_type: str,
        sector_id: str,
        activity_id: str,
        project_type_id: str,
        geography_id: str,
        project_scale: str,
        blueprint_id: str,
        blueprint_version: str,
        responses: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Constructs a canonical, normalized DPR Project Object.
        """
        # 1. Project Info
        project_info = {
            "id": project_id,
            "business_name": business_name or responses.get("business_name", "Karnataka Enterprise"),
            "dpr_type": dpr_type,
            "blueprint_id": blueprint_id,
            "blueprint_version": blueprint_version,
            "created_at": str(datetime.datetime.now())
        }

        # 2. Business Entity
        business_info = {
            "entity_type": responses.get("entity_type", "Proprietorship"),
            "primary_product": responses.get("primary_product", "Industrial Products"),
            "hsn_code": responses.get("hsn_code", "84799090"),
            "gstin": responses.get("gst_no", responses.get("gstin", "")),
            "pan": responses.get("pan_no", responses.get("pan", "")),
            "udyam": responses.get("udyam_no", responses.get("udyam", "")),
            "description": responses.get("business_desc", "Commercial project venture.")
        }

        # 3. Promoter Info
        promoter_info = {
            "contact_name": responses.get("contact_name", "Promoter User"),
            "email": responses.get("email", ""),
            "phone": responses.get("contact_number", responses.get("phone", "")),
            "category": responses.get("q_category", "General"),
            "cibil_score": responses.get("cibil_score", 750)
        }

        # 4. Location & Geography
        location_info = {
            "country": "India",
            "state": responses.get("state", "Karnataka"),
            "district": responses.get("district", "Bengaluru Urban"),
            "block": responses.get("block", ""),
            "village": responses.get("village", "")
        }

        # 5. Project Classification
        classification = {
            "sector_id": sector_id,
            "activity_id": activity_id,
            "project_type_id": project_type_id,
            "geography_id": geography_id,
            "project_scale": project_scale
        }

        # 6. Project Cost Normalization (CapEx & Working Capital)
        land_cost = float(responses.get("land_cost", 0.0))
        building_cost = float(responses.get("building_cost", 0.0))
        machinery_cost = float(responses.get("machinery_cost", 0.0))
        furniture_cost = float(responses.get("furniture_cost", 0.0))
        working_capital = float(responses.get("working_capital", 500000.0))
        other_cost = float(responses.get("other_cost", 0.0))

        raw_total_cost = float(responses.get("total_cost", 0.0))
        calculated_cost = land_cost + building_cost + machinery_cost + furniture_cost + working_capital + other_cost
        final_total_cost = raw_total_cost if raw_total_cost > 0 else calculated_cost

        project_cost = {
            "land": land_cost,
            "building": building_cost,
            "machinery": machinery_cost,
            "furniture": furniture_cost,
            "working_capital": working_capital,
            "other": other_cost,
            "total": final_total_cost
        }

        # 7. Means of Finance Normalization
        promoter_equity = float(responses.get("promoter_contribution", 0.0))
        term_loan = float(responses.get("bank_loan", 0.0))
        subsidy = float(responses.get("subsidy", 0.0))

        if promoter_equity == 0 and term_loan == 0 and final_total_cost > 0:
            promoter_equity = round(final_total_cost * 0.25, 2)
            term_loan = round(final_total_cost * 0.75, 2)

        total_funding = promoter_equity + term_loan + subsidy

        funding = {
            "promoter_equity": promoter_equity,
            "term_loan": term_loan,
            "subsidy": subsidy,
            "total_funding": total_funding
        }

        # 8. Financial Assumptions
        assumptions = {
            "interest_rate_percent": float(responses.get("q_interest_rate", 10.5)),
            "tenure_years": int(responses.get("q_tenure", 5)),
            "tax_rate_percent": 25.0,
            "depreciation_rate_percent": 15.0,
            "revenue_growth_rate_percent": 10.0
        }

        # 9. Provenance Tracking Map
        provenance = {
            "total_cost": "USER_PROVIDED" if raw_total_cost > 0 else "SYSTEM_CALCULATED",
            "promoter_equity": "USER_PROVIDED" if responses.get("promoter_contribution") else "SYSTEM_CALCULATED",
            "term_loan": "USER_PROVIDED" if responses.get("bank_loan") else "SYSTEM_CALCULATED"
        }

        canonical = {
            "project": project_info,
            "business": business_info,
            "promoter": promoter_info,
            "location": location_info,
            "classification": classification,
            "project_cost": project_cost,
            "funding": funding,
            "assumptions": assumptions,
            "provenance": provenance
        }

        return canonical
