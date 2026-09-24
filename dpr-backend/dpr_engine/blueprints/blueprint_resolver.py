from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session
from models.database_models import (
    DPRBlueprintDB, DPRSectorDB, DPRBusinessActivityDB,
    DPRProjectTypeDB, DPRGeographyDB, DPRProjectDB
)
from dpr_engine.blueprints.seed_data import (
    DPR_TYPES, SECTORS, BUSINESS_ACTIVITIES,
    PROJECT_TYPES, GEOGRAPHIES, DEFAULT_BLUEPRINTS
)

class DynamicBlueprintResolver:

    @classmethod
    def get_dpr_types(cls) -> List[Dict[str, Any]]:
        return DPR_TYPES

    @classmethod
    def get_sectors(cls, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        if db:
            try:
                db_sectors = db.query(DPRSectorDB).filter(DPRSectorDB.is_active == True).all()
                if db_sectors:
                    return [
                        {"id": s.id, "name": s.name, "description": s.description, "icon": s.icon}
                        for s in db_sectors
                    ]
            except Exception as e:
                print(f"Warning: Falling back to seed sectors: {e}")
        return SECTORS

    @classmethod
    def get_activities_by_sector(cls, sector_id: str, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        if db:
            try:
                db_acts = db.query(DPRBusinessActivityDB).filter(
                    DPRBusinessActivityDB.sector_id == sector_id,
                    DPRBusinessActivityDB.is_active == True
                ).all()
                if db_acts:
                    return [
                        {"id": a.id, "sector_id": a.sector_id, "name": a.name, "description": a.description, "hsn_code": a.hsn_code}
                        for a in db_acts
                    ]
            except Exception as e:
                print(f"Warning: Falling back to seed activities: {e}")

        return [a for a in BUSINESS_ACTIVITIES if a.get("sector_id") == sector_id or not sector_id]

    @classmethod
    def get_project_types(cls, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        if db:
            try:
                db_pts = db.query(DPRProjectTypeDB).all()
                if db_pts:
                    return [{"id": p.id, "name": p.name, "description": p.description} for p in db_pts]
            except Exception as e:
                print(f"Warning: Falling back to seed project types: {e}")
        return PROJECT_TYPES

    @classmethod
    def get_geographies(cls, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        if db:
            try:
                db_geos = db.query(DPRGeographyDB).filter(DPRGeographyDB.is_active == True).all()
                if db_geos:
                    return [
                        {"id": g.id, "country": g.country, "state": g.state, "districts": g.districts_json or []}
                        for g in db_geos
                    ]
            except Exception as e:
                print(f"Warning: Falling back to seed geographies: {e}")
        return GEOGRAPHIES

    @classmethod
    def resolve_blueprint(
        cls,
        dpr_type: str,
        sector_id: str = "manufacturing",
        activity_id: str = "spice_processing",
        project_type_id: str = "new_project",
        geography_id: str = "IN-KA",
        project_scale: str = "medium",
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        # Normalize DPR type string
        norm_type = dpr_type
        if "Govt" in dpr_type or "Subsidy" in dpr_type:
            norm_type = "Govt Subsidy DPR"
        elif "Investor" in dpr_type or "Pitch" in dpr_type:
            norm_type = "Investor / Business Pitch DPR"
        else:
            norm_type = "Bank Loan DPR"

        # 1. Fetch or create base blueprint configuration
        blueprint_data = DEFAULT_BLUEPRINTS.get(norm_type, DEFAULT_BLUEPRINTS["Bank Loan DPR"])
        if db:
            try:
                db_bp = db.query(DPRBlueprintDB).filter(
                    DPRBlueprintDB.dpr_type == norm_type,
                    DPRBlueprintDB.is_active == True
                ).first()
                if db_bp:
                    blueprint_data = {
                        "id": db_bp.id,
                        "dpr_type": db_bp.dpr_type,
                        "version": db_bp.version,
                        "name": db_bp.name,
                        "description": db_bp.description,
                        "sections": db_bp.sections_json,
                        "questions": db_bp.questions_json,
                        "rules": db_bp.rules_json,
                        "documents": db_bp.documents_json
                    }
            except Exception as e:
                print(f"Warning: Blueprint DB query failed: {e}")

        # 2. Fetch sector & activity details
        sector_info = next((s for s in SECTORS if s["id"] == sector_id), {"id": sector_id, "name": sector_id.title()})
        activity_info = next((a for a in BUSINESS_ACTIVITIES if a["id"] == activity_id), {"id": activity_id, "name": activity_id.title()})
        project_type_info = next((p for p in PROJECT_TYPES if p["id"] == project_type_id), {"id": project_type_id, "name": project_type_id.title()})
        geography_info = next((g for g in GEOGRAPHIES if g["id"] == geography_id), GEOGRAPHIES[0])

        # 3. Synthesize dynamic questions based on sector, track, and project type
        common_questions = [
            {"id": "business_name", "key": "business_name", "label": "Enterprise / Business Name", "type": "text", "required": True},
            {"id": "entity_type", "key": "entity_type", "label": "Legal Constitution", "type": "select", "options": ["Proprietorship", "Partnership", "Private Limited Company", "LLP", "JLG", "SHG"], "required": True},
            {"id": "district", "key": "district", "label": "Project District", "type": "select", "options": geography_info.get("districts", ["Bengaluru Urban", "Mysuru"]), "required": True},
            {"id": "primary_product", "key": "primary_product", "label": "Primary Product / Service Name", "type": "text", "default_value": activity_info.get("name"), "required": True},
            {"id": "hsn_code", "key": "hsn_code", "label": "HSN / SAC Code", "type": "text", "default_value": activity_info.get("hsn_code", "84799090")},
            {"id": "total_cost", "key": "total_cost", "label": "Total Estimated Project Cost (₹)", "type": "number", "required": True, "default_value": 25000000}
        ]

        if norm_type == "Bank Loan DPR":
            common_questions.extend([
                {"id": "bank_loan", "key": "bank_loan", "label": "Bank Debt Loan Required (₹)", "type": "number", "required": True, "default_value": 17500000},
                {"id": "promoter_contribution", "key": "promoter_contribution", "label": "Promoter Margin Equity Contribution (₹)", "type": "number", "required": True, "default_value": 7500000}
            ])
        elif norm_type == "Govt Subsidy DPR":
            common_questions.extend([
                {"id": "subsidy", "key": "subsidy", "label": "Expected Government Capital Subsidy (₹)", "type": "number", "required": True, "default_value": 3500000},
                {"id": "promoter_contribution", "key": "promoter_contribution", "label": "Promoter Margin Money Contribution (₹)", "type": "number", "required": True, "default_value": 4000000},
                {"id": "bank_loan", "key": "bank_loan", "label": "Nodal Bank Bridge Loan (₹)", "type": "number", "default_value": 17500000}
            ])
        elif norm_type == "Investor / Business Pitch DPR":
            common_questions.extend([
                {"id": "promoter_contribution", "key": "promoter_contribution", "label": "Founders Existing Invested Capital (₹)", "type": "number", "required": True, "default_value": 10000000}
            ])

        # Combine common questions + track specific blueprint questions
        type_questions = blueprint_data.get("questions", [])
        resolved_questions = common_questions + type_questions

        # 4. Sector & Activity Specific Required Documents
        required_documents = [
            {"id": "doc_kyc", "name": "Promoter PAN & Aadhaar KYC Cards", "required": True},
            {"id": "doc_udyam", "name": "UDYAM Registration Certificate", "required": True},
            {"id": "doc_land", "name": "Land Lease / Ownership Document", "required": True},
            {"id": "doc_quotations", "name": "Machinery & Equipment Supplier Quotations", "required": True}
        ]
        if norm_type == "Bank Loan DPR":
            required_documents.append({"id": "doc_cibil", "name": "Promoter CIBIL Credit Report", "required": True})
        elif norm_type == "Govt Subsidy DPR":
            required_documents.append({"id": "doc_caste", "name": "Caste / Social Category Certificate (if applicable)", "required": False})
        elif norm_type == "Investor / Business Pitch DPR":
            required_documents.append({"id": "doc_pitch", "name": "Executive Pitch Deck & Traction Proof", "required": True})

        # 5. Calculation Rules & Validation Constraints
        resolved_rules = {
            "min_promoter_equity_percent": 15.0 if norm_type == "Govt Subsidy DPR" else 20.0,
            "max_debt_equity_ratio": 4.0 if norm_type == "Bank Loan DPR" else 5.0,
            "min_dscr_ratio": 1.25,
            "max_bep_percent": 75.0,
            "standard_tax_rate_percent": 25.0,
            "interest_rate_percent": 10.5
        }

        resolved_blueprint = {
            "blueprint_id": blueprint_data.get("id"),
            "dpr_type": norm_type,
            "version": blueprint_data.get("version", "1.0.0"),
            "name": f"{blueprint_data.get('name')} - {sector_info.get('name')} ({activity_info.get('name')})",
            "sector": sector_info,
            "business_activity": activity_info,
            "project_type": project_type_info,
            "geography": geography_info,
            "project_scale": project_scale,
            "sections": blueprint_data.get("sections", []),
            "questions": resolved_questions,
            "documents": required_documents,
            "rules": resolved_rules
        }

        return resolved_blueprint
