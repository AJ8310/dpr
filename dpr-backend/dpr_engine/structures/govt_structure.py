from typing import List, Dict, Any
from dpr_engine.data_model import DPRDepthEnum

class GovtDPRStructure:

    @staticmethod
    def get_sections(depth: DPRDepthEnum) -> List[Dict[str, Any]]:
        sections = [
            {"id": "cover", "title": "Cover Page & Government Scheme Header", "number": "0.0", "summary_include": True},
            {"id": "scheme_summary", "title": "Scheme Application Summary & Subsidy Claim Matrix", "number": "1.0", "summary_include": True},
            {"id": "applicant_profile", "title": "Applicant Social Category, Location & EDP Qualification", "number": "2.0", "summary_include": True},
            {"id": "business_overview", "title": "Business Entity & Statutory Registrations (Udyam / GST)", "number": "3.0", "summary_include": True},
            {"id": "scheme_objective", "title": "Alignment with Scheme Objectives & Local Development", "number": "4.0", "summary_include": True},
            {"id": "product_description", "title": "Product Specifications, Capacity & Raw Material Sourcing", "number": "5.0", "summary_include": True},
            {"id": "machinery_equipment", "title": "Itemized Machinery Quotations & Electrification Plan", "number": "6.0", "summary_include": True},
            {"id": "project_cost", "title": "Cost of Project & Capital Outlay", "number": "7.0", "summary_include": True},
            {"id": "means_of_finance", "title": "Means of Finance & Margin Money Subsidy Computation", "number": "8.0", "summary_include": True},
            {"id": "employment_generation", "title": "Employment Generation (Local, Women & Youth)", "number": "9.0", "summary_include": True},
            {"id": "social_impact", "title": "Socio-Economic & Eco-Friendly Environmental Impact", "number": "10.0", "summary_include": True},
            {"id": "financial_viability", "title": "5-Year Financial Projections & DSCR Viability", "number": "11.0", "summary_include": True},
            {"id": "scheme_compliance", "title": "Scheme Nodal Agency Compliance & Undertaking", "number": "12.0", "summary_include": True},
            {"id": "annexures", "title": "Annexures A–F (EDP Certificate, Quotations, Caste & Land Docs)", "number": "13.0", "summary_include": True},
        ]
        return sections
