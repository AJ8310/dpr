from typing import List, Dict, Any
from dpr_engine.data_model import DPRDepthEnum

class BankDPRStructure:

    @staticmethod
    def get_sections(depth: DPRDepthEnum) -> List[Dict[str, Any]]:
        # Base 29 Sections for Bank Loan DPR
        base_sections = [
            {"id": "cover", "title": "Cover Page", "number": "0.0", "summary_include": True},
            {"id": "exec_summary", "title": "Executive Summary & Key Project Metrics", "number": "1.0", "summary_include": True},
            {"id": "promoter_profile", "title": "Promoter Board, Profile & Management Background", "number": "2.0", "summary_include": True},
            {"id": "business_overview", "title": "Business Constitution & Statutory Registrations", "number": "3.0", "summary_include": True},
            {"id": "project_background", "title": "Project Rationale, Objectives & Industry Context", "number": "4.0", "summary_include": False},
            {"id": "product_description", "title": "Product Specifications, HSN Codes & Installed Capacity", "number": "5.0", "summary_include": True},
            {"id": "market_analysis", "title": "Target Market Demand & Industry Growth Vectors", "number": "6.0", "summary_include": True},
            {"id": "technical_feasibility", "title": "Technical Feasibility & Technology Selection", "number": "7.0", "summary_include": False},
            {"id": "process_flow", "title": "Manufacturing Process & Quality Control Protocol", "number": "8.0", "summary_include": True},
            {"id": "machinery_equipment", "title": "Plant, Machinery & Electrification Schedules", "number": "9.0", "summary_include": True},
            {"id": "raw_materials", "title": "Raw Material Supply Chain & Input Logistics", "number": "10.0", "summary_include": False},
            {"id": "infrastructure", "title": "Land, Building, Utilities & Power Load Sanction", "number": "11.0", "summary_include": False},
            {"id": "manpower", "title": "Human Resource Staffing Plan & Monthly Wages", "number": "12.0", "summary_include": True},
            {"id": "project_cost", "title": "Cost of Project & Capital Expenditure Breakdown", "number": "13.0", "summary_include": True},
            {"id": "means_of_finance", "title": "Means of Finance & Promoter Contribution Ratio", "number": "14.0", "summary_include": True},
            {"id": "working_capital", "title": "Working Capital Assessment & Nayak Committee Limit", "number": "15.0", "summary_include": False},
            {"id": "marketing_strategy", "title": "Sales Channels, Pricing Strategy & Distribution", "number": "16.0", "summary_include": False},
            {"id": "financial_projections", "title": "5-Year Financial Projections & Operational Assumptions", "number": "17.0", "summary_include": True},
            {"id": "projected_pnl", "title": "Projected Income Statement (P&L Account)", "number": "18.0", "summary_include": True},
            {"id": "projected_balance_sheet", "title": "Projected Balance Sheet Statement", "number": "19.0", "summary_include": True},
            {"id": "cash_flow_statement", "title": "Projected Cash Flow & Fund Flow Statement", "number": "20.0", "summary_include": False},
            {"id": "breakeven_analysis", "title": "Break-Even Point (BEP %) & Sensitivity Analysis", "number": "21.0", "summary_include": True},
            {"id": "dscr_analysis", "title": "Debt Service Coverage Ratio (DSCR) Analysis", "number": "22.0", "summary_include": True},
            {"id": "loan_amortization", "title": "Bank Loan Repayment & Interest Amortization Schedule", "number": "23.0", "summary_include": True},
            {"id": "risk_analysis", "title": "Project Risks & Risk Mitigation Strategies", "number": "24.0", "summary_include": False},
            {"id": "swot_analysis", "title": "SWOT Analysis Matrix", "number": "25.0", "summary_include": True},
            {"id": "implementation_schedule", "title": "Gantt Chart Implementation Timeline", "number": "26.0", "summary_include": False},
            {"id": "conclusion", "title": "Bank Loan Sanction Recommendation & Legal Declaration", "number": "27.0", "summary_include": True},
            {"id": "annexures", "title": "Annexures A–F (Supporting Documents & Certificates)", "number": "28.0", "summary_include": True},
        ]

        if depth == DPRDepthEnum.SUMMARY:
            return [s for s in base_sections if s["summary_include"]]
        elif depth == DPRDepthEnum.STANDARD:
            return base_sections
        elif depth == DPRDepthEnum.DETAILED:
            # Add detailed sub-analysis subsections
            return base_sections
        else:
            # Comprehensive 70-100+ pages: All sections + expanded annexures
            return base_sections
