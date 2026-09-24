from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from models.database_models import DPRPromptTemplateDB

class PromptTemplateEngine:
    """
    Versioned prompt templates per section key and DPR type with system instructions and schemas.
    """

    DEFAULT_TEMPLATES = {
        "sec_exec": {
            "id": "prompt_sec_exec_v1.0",
            "section_key": "sec_exec",
            "system_instruction": "Generate a professional Executive Summary. All financial figures (CapEx, Debt, Equity, DSCR, Revenue) MUST match the provided financial context EXACTLY.",
            "version": "1.0.0"
        },
        "sec_promoter": {
            "id": "prompt_sec_promoter_v1.0",
            "section_key": "sec_promoter",
            "system_instruction": "Generate Promoter & Entity Background detailing management profile, legal entity, and CIBIL standing.",
            "version": "1.0.0"
        },
        "sec_business": {
            "id": "prompt_sec_business_v1.0",
            "section_key": "sec_business",
            "system_instruction": "Generate Business & Technical Feasibility overview, product HSN codes, and operational workflow.",
            "version": "1.0.0"
        },
        "sec_market": {
            "id": "prompt_sec_market_v1.0",
            "section_key": "sec_market",
            "system_instruction": "Generate Market Demand & Industry Overview. Classify insights into FACT, INFERENCE, and ASSUMPTION.",
            "version": "1.0.0"
        },
        "sec_cost": {
            "id": "prompt_sec_cost_v1.0",
            "section_key": "sec_cost",
            "system_instruction": "Generate Project Cost & Means of Finance section. Verify cost equals total funding.",
            "version": "1.0.0"
        },
        "sec_financials": {
            "id": "prompt_sec_financials_v1.0",
            "section_key": "sec_financials",
            "system_instruction": "Generate 5-Year Financial Statements & Ratios commentary (DSCR, BEP %). Do not invent numbers.",
            "version": "1.0.0"
        }
    }

    @classmethod
    def get_template(cls, section_key: str, dpr_type: str, db: Optional[Session] = None) -> Dict[str, Any]:
        if db:
            tpl_db = db.query(DPRPromptTemplateDB).filter(
                DPRPromptTemplateDB.section_key == section_key,
                DPRPromptTemplateDB.is_active == True
            ).first()
            if tpl_db:
                return {
                    "id": tpl_db.id,
                    "section_key": tpl_db.section_key,
                    "system_instruction": tpl_db.system_instruction,
                    "version": tpl_db.version
                }

        return cls.DEFAULT_TEMPLATES.get(section_key, {
            "id": f"prompt_{section_key}_v1.0",
            "section_key": section_key,
            "system_instruction": "Generate detailed, professional narrative for this DPR section. Preserve financial exactness.",
            "version": "1.0.0"
        })
