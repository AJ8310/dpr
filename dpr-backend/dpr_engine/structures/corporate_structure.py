from typing import List, Dict, Any

class CorporateDPRStructure:
    """
    Corporate DPR Structure: Comprehensive Sections for Corporate & Enterprise Projects.
    Tailored for medium to large enterprise ventures (₹5 Cr to ₹500+ Cr) requiring DCF Valuation,
    IRR/NPV Analysis, WACC, Sensitivity Matrix, TCRM Assessment, and ESG/Environmental Compliance.
    """

    SECTIONS: List[Dict[str, Any]] = [
        {"id": 1, "title": "1.0 Executive Summary & Project Memorandum", "required": True, "depth": "summary"},
        {"id": 2, "title": "2.0 Corporate Profile, Promoters & Board Governance", "required": True, "depth": "summary"},
        {"id": 3, "title": "3.0 Strategic Project Background & Investment Rationale", "required": True, "depth": "standard"},
        {"id": 4, "title": "4.0 Macro-Economic & Industry Sector Analysis", "required": True, "depth": "standard"},
        {"id": 5, "title": "5.0 Product Engineering, HSN & Technical Specifications", "required": True, "depth": "summary"},
        {"id": 6, "title": "6.0 Target Market, TAM/SAM/SOM & Off-take Agreements", "required": True, "depth": "standard"},
        {"id": 7, "title": "7.0 Installed Capacity, OEE & Operational Assumptions", "required": True, "depth": "standard"},
        {"id": 8, "title": "8.0 Raw Material Sourcing & Supply Chain Resilience", "required": True, "depth": "standard"},
        {"id": 9, "title": "9.0 Technology Partner, Licensing & Machinery Selection", "required": True, "depth": "standard"},
        {"id": 10, "title": "10.0 Site Location, Connectivity & Land Infrastructure", "required": True, "depth": "standard"},
        {"id": 11, "title": "11.0 Civil Engineering & Building Construction Plan", "required": True, "depth": "detailed"},
        {"id": 12, "title": "12.0 Power, Water, Utilities & Effluent Treatment (ETP/ZLD)", "required": True, "depth": "detailed"},
        {"id": 13, "title": "13.0 Human Capital, HR Payroll & Labor Laws Compliance", "required": True, "depth": "standard"},
        {"id": 14, "title": "14.0 Statutory Consents, MoEFCC & PCB Approvals", "required": True, "depth": "standard"},
        {"id": 15, "title": "15.0 Itemized Capital Expenditure (CAPEX) Schedule", "required": True, "depth": "summary"},
        {"id": 16, "title": "16.0 Means of Finance, Debt-Equity & Capital Structure", "required": True, "depth": "summary"},
        {"id": 17, "title": "17.0 5-Year / 10-Year Projected Income Statement (P&L)", "required": True, "depth": "summary"},
        {"id": 18, "title": "18.0 5-Year / 10-Year Projected Balance Sheet", "required": True, "depth": "summary"},
        {"id": 19, "title": "19.0 5-Year / 10-Year Cash Flow Statement (FCFF)", "required": True, "depth": "summary"},
        {"id": 20, "title": "20.0 Discounted Cash Flow (DCF) & Enterprise Valuation", "required": True, "depth": "detailed"},
        {"id": 21, "title": "21.0 Project IRR, Equity IRR & Net Present Value (NPV)", "required": True, "depth": "detailed"},
        {"id": 22, "title": "22.0 Weighted Average Cost of Capital (WACC) Analysis", "required": True, "depth": "detailed"},
        {"id": 23, "title": "23.0 Debt Service Coverage Ratio (DSCR) & Amortization", "required": True, "depth": "summary"},
        {"id": 24, "title": "24.0 Break-Even Point (BEP) & Operating Leverage", "required": True, "depth": "summary"},
        {"id": 25, "title": "25.0 Multi-Scenario Sensitivity Analysis Matrix", "required": True, "depth": "detailed"},
        {"id": 26, "title": "26.0 NITI Aayog TCRM (Techno-Commercial Readiness) Matrix", "required": True, "depth": "detailed"},
        {"id": 27, "title": "27.0 ESG (Environmental, Social & Governance) Framework", "required": True, "depth": "detailed"},
        {"id": 28, "title": "28.0 Operational & Financial Risk Mitigation Strategy", "required": True, "depth": "standard"},
        {"id": 29, "title": "29.0 Project Implementation Schedule & PERT/CPM Chart", "required": True, "depth": "standard"},
        {"id": 30, "title": "30.0 Annexure A: Detailed Machinery & Vendor Schedules", "required": True, "depth": "detailed"},
        {"id": 31, "title": "31.0 Annexure B: 10-Year Financial Model Spreadsheets", "required": True, "depth": "detailed"},
        {"id": 32, "title": "32.0 Corporate Declaration & Board Resolution Sign-Off", "required": True, "depth": "summary"}
    ]

    @classmethod
    def get_structure_for_depth(cls, depth_level: str) -> Dict[str, Any]:
        depth_order = ["summary", "standard", "detailed"]
        clean_depth = str(depth_level).lower().strip()
        if "comp" in clean_depth or clean_depth not in depth_order:
            clean_depth = "detailed"

        target_idx = depth_order.index(clean_depth)

        active_sections = [
            s for s in cls.SECTIONS
            if depth_order.index(s["depth"] if s["depth"] in depth_order else "detailed") <= target_idx
        ]

        pages_map = {
            "summary": "15-20 pages",
            "standard": "25-35 pages",
            "detailed": "45-65 pages"
        }

        return {
            "dpr_type": "Corporate Enterprise DPR",
            "depth_level": clean_depth,
            "target_page_range": pages_map.get(clean_depth, "25-35 pages"),
            "section_count": len(active_sections),
            "sections": active_sections
        }
