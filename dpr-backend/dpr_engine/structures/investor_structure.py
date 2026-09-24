from typing import List, Dict, Any
from dpr_engine.data_model import DPRDepthEnum

class InvestorDPRStructure:

    @staticmethod
    def get_sections(depth: DPRDepthEnum) -> List[Dict[str, Any]]:
        base_sections = [
            {"id": "cover", "title": "Cover Page & Investment Memorandum Header", "number": "0.0", "summary_include": True},
            {"id": "exec_summary", "title": "Executive Summary & Investment Opportunity Highlight", "number": "1.0", "summary_include": True},
            {"id": "problem_statement", "title": "Market Problem Statement & Unmet Industry Needs", "number": "2.0", "summary_include": True},
            {"id": "solution_overview", "title": "Proprietary Solution, Product Innovation & Value Prop", "number": "3.0", "summary_include": True},
            {"id": "product_specs", "title": "Product Specifications, Tech Stack & Quality Standards", "number": "4.0", "summary_include": True},
            {"id": "business_model", "title": "Business Model, Monetization Strategy & Unit Economics", "number": "5.0", "summary_include": True},
            {"id": "market_opportunity", "title": "Market Sizing: Total Addressable Market (TAM/SAM/SOM)", "number": "6.0", "summary_include": True},
            {"id": "industry_analysis", "title": "Macro Industry Trends & Regulatory Tailwinds", "number": "7.0", "summary_include": False},
            {"id": "customer_segments", "title": "Target Customer Segments & Buyer Personas", "number": "8.0", "summary_include": False},
            {"id": "traction", "title": "Traction, Historical Milestones & Key Performance Metrics", "number": "9.0", "summary_include": True},
            {"id": "competitive_landscape", "title": "Competitive Landscape & Positioning Matrix", "number": "10.0", "summary_include": True},
            {"id": "competitive_advantage", "title": "Moat, IP Protection & Competitive Advantages", "number": "11.0", "summary_include": True},
            {"id": "gtm_strategy", "title": "Go-To-Market (GTM) Expansion & Customer Acquisition", "number": "12.0", "summary_include": True},
            {"id": "founding_team", "title": "Founding Team, Advisory Board & Key Talent", "number": "13.0", "summary_include": True},
            {"id": "tech_ip", "title": "Technology Architecture, R&D Roadmap & Scalability", "number": "14.0", "summary_include": False},
            {"id": "operations", "title": "Manufacturing, Operations & Supply Chain Infrastructure", "number": "15.0", "summary_include": False},
            {"id": "hr_plan", "title": "Organization Structure & Talent Scaling Plan", "number": "16.0", "summary_include": False},
            {"id": "project_cost", "title": "Capital Expenditure & Expansion Outlay", "number": "17.0", "summary_include": True},
            {"id": "financial_performance", "title": "Historical & Current Financial Performance", "number": "18.0", "summary_include": True},
            {"id": "financial_projections", "title": "5-Year Financial Projections & EBITDA Growth", "number": "19.0", "summary_include": True},
            {"id": "funding_ask", "title": "Investment Ask Amount & Capital Structuring", "number": "20.0", "summary_include": True},
            {"id": "use_of_funds", "title": "Detailed Use of Funds Allocation Breakdown", "number": "21.0", "summary_include": True},
            {"id": "valuation", "title": "Pre-Money Valuation, Equity Stake Offered & Cap Table", "number": "22.0", "summary_include": True},
            {"id": "growth_strategy", "title": "Post-Investment Growth Scaling Strategy", "number": "23.0", "summary_include": False},
            {"id": "risks_mitigation", "title": "Risk Factors & Investor Risk Mitigation Plan", "number": "24.0", "summary_include": False},
            {"id": "exit_strategy", "title": "Investor Exit Routes (Strategic M&A, Secondary VC Sale)", "number": "25.0", "summary_include": True},
            {"id": "conclusion", "title": "Investment Conclusion & Next Steps", "number": "26.0", "summary_include": True},
            {"id": "annexures", "title": "Annexures A–F (Cap Table, Product Patents, Financial Models)", "number": "27.0", "summary_include": True},
        ]

        if depth == DPRDepthEnum.SUMMARY:
            return [s for s in base_sections if s["summary_include"]]
        return base_sections
