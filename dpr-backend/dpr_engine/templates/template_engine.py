import os
import base64
from jinja2 import Environment, FileSystemLoader
from typing import Dict, Any
from dpr_engine.data_model import DPRDocumentModel
from dpr_engine.structures.structure_engine import DPRStructureEngine
from dpr_engine.content_library.content_engine import DPRContentEngine
from dpr_engine.visuals.diagram_engine import DeterministicDiagramEngine
from dpr_engine.visuals.image_engine import ImageManagementEngine

from dpr_engine.document.renderers.chart_renderer import ChartRenderer
from dpr_engine.utils.currency import format_inr, format_indian_words


REPORT_I18N: Dict[str, Dict[str, str]] = {
    "en": {
        "dpr_cover_title": "DETAILED PROJECT REPORT",
        "manufacturing_unit": "Manufacturing Unit",
        "by_vkf": "By Vision Karnataka Foundation",
        "lbl_enterprise_name": "Name of Enterprise:",
        "lbl_service_type": "DPR Service Type:",
        "lbl_quality_tier": "Plan Quality Tier:",
        "lbl_financial_horizon": "Financial Horizon:",
        "lbl_legal_constitution": "Legal Constitution:",
        "lbl_district_state": "District & State:",
        "lbl_total_cost": "Total Project Cost:",
        "lbl_bank_loan": "Bank Loan Required:",
        "lbl_promoter_equity": "Promoter Equity:",
        "toc_title": "TABLE OF CONTENT",
        "th_sl_no": "SL NO",
        "th_content_section": "Content Section",
        "th_page_no": "Page No",
        "toc_sec1": "Overview of the JLG / Enterprise Members",
        "toc_sec2": "Objectives of SVSY & Yuva Shakti Framework",
        "toc_sec3": "About Vision Karnataka Foundation (VKF)",
        "toc_sec4": "Name of the Product & Technology",
        "toc_sec5": "Deliverables and Market of the Product",
        "toc_sec6": "Role of Each Member & Staffing Hierarchy",
        "toc_sec7": "Soft Intervention & Capacity Building",
        "toc_sec8": "Estimated Cost of Project & Implementation Schedule",
        "toc_sec9": "Land / Shed Infrastructure Status",
        "toc_sec10": "SWOT Analysis",
        "toc_sec11": "Youth Empowerment & Impact of Project on Ecosystem",
        "toc_sec12": "The End Products Produced (Image Placeholders)",
        "toc_sec13": "Financials & Amortization Schedules",
        "sec1_title": "1. OVERVIEW OF THE JLG / ENTERPRISE MEMBERS",
        "sec1_sub": "Details of Members with Hierarchy:",
        "sec1_lbl_name": "Name of the Enterprise / JLG:",
        "sec1_lbl_group": "Group / Promoter Name:",
        "sec1_lbl_gp": "Gram Panchayat / Taluk:",
        "sec1_lbl_dist": "District & State:",
        "sec1_lbl_bank": "Account & Bank Details:",
        "sec1_lbl_udyam": "Udyam / GST / CIBIL:",
        "sec2_title": "2. OBJECTIVES OF SVSY & CORPORATE PROFILE",
        "sec3_title": "3. MACROECONOMIC ENVIRONMENT & PROJECT BACKGROUND",
        "sec4_title": "4. NAME OF THE PRODUCT AND TECHNOLOGY",
        "sec5_title": "5. DELIVERABLES AND MARKET OF THE PRODUCT",
        "sec5_sub_assump": "Detailed Project Assumptions Table:",
        "sec5_sub_mach": "Plant & Machinery Equipment Details:",
        "sec6_title": "6. ROLE OF EACH MEMBER, STAFFING HIERARCHY & TECHNICAL FEASIBILITY",
        "sec7_title": "7. SOFT INTERVENTION, CAPACITY BUILDING & RISK ANALYSIS",
        "sec8_title": "8. ESTIMATED COST OF PROJECT & IMPLEMENTATION SCHEDULE",
        "sec8_sub_charts": "CAPITAL EXPENDITURE & MEANS OF FINANCE CHARTS",
        "sec9_title": "9. LAND & INFRASTRUCTURE STATUS",
        "sec10_title": "10. SWOT ANALYSIS & STRATEGIC ROADMAP",
        "sec11_title": "11. YOUTH EMPOWERMENT & ECOSYSTEM IMPACT",
        "sec12_title": "12. THE END PRODUCTS PRODUCED & QUALITY ASSURANCE",
        "sec13_title": "13. FINANCIALS & PROJECTIONS",
        "sec13_sub_cashflow": "5-YEAR CASH FLOW STATEMENT (₹)",
        "sec13_sub_dscr": "PROJECTED TERM LOAN DSCR STATEMENT",
        "sec13_sub_charts": "FINANCIAL PROJECTIONS & DSCR RATIO VISUALIZATION CHARTS",
        "sec13_sub_val": "ADVANCED CORPORATE FINANCIAL VALUATION (DCF & IRR ANALYSIS)",
        "sec13_sub_sens": "MULTI-SCENARIO SENSITIVITY ANALYSIS MATRIX",
        "sec13_sub_esg": "ESG (ENVIRONMENTAL, SOCIAL & GOVERNANCE) & TCRM SCORECARD",
        "sec14_title": "14. WORKING CAPITAL ASSESSMENT SCHEDULE (TANDON COMMITTEE NORMS)",
        "sec15_title": "15. COMPREHENSIVE DEPRECIATION SCHEDULE (INCOME TAX ACT 1961) & ESG SCORECARD",
        "sec16_title": "16. TERM LOAN AMORTIZATION & TECHNOLOGY READINESS (TCRM)",
        "sec17_title": "17. 10-YEAR EXTENDED FINANCIAL PROJECTIONS (P&L STATEMENT)",
        "sec18_title": "18. 36-MONTH DETAILED MONTHLY CASH FLOW STATEMENT",
        "sec19_title": "19. RAW MATERIAL BILL OF QUANTITIES (BOQ) & PROCUREMENT MATRIX",
        "sec20_title": "20. COMPREHENSIVE MANPOWER SALARY & DESIGNATION MATRIX",
        "sec21_title": "21. TANDON & NAYAK COMMITTEE WORKING CAPITAL NORMS",
        "sec22_title": "22. TECHNOLOGY COMMERCIALIZATION & READINESS LEVEL (TCRM) AUDIT",
        "sec23_title": "23. ESG & ENVIRONMENTAL SUSTAINABILITY SCORECARD",
        "sec24_title": "24. MULTI-SCENARIO SENSITIVITY & STRESS-TEST ANALYSIS",
        "sec25_title": "25. SWOT ANALYSIS & COMPETITOR BENCHMARK MATRIX",
        "sec26_title": "26. APPLICABLE CENTRAL & STATE SUBSIDY SCHEMES",
        "sec27_title": "27. SITE INFRASTRUCTURE, POWER GRID & UTILITIES SPECIFICATIONS",
        "sec28_title": "28. MARKETING, BRANDING & DISTRIBUTION CHANNEL STRATEGY",
        "sec29_title": "29. STATUTORY COMPLIANCES, LICENSES & APPROVALS CHECKLIST",
        "sec30_title": "30. BANK LOAN RECOMMENDATION & CONCLUSION",
        "sec31_title": "31. DECLARATION & AUTHORIZED SIGN-OFF",
        "decl_text": "I / We hereby declare that the particulars, financial estimates, and project details given above are true and correct to the best of my / our knowledge and belief. All financial projections have been prepared based on realistic operating parameters and institutional benchmarks for credit sanction.",
        "decl_doc_ref": "Document Reference:",
        "decl_guidance": "Prepared Under Guidance Of:",
        "decl_guidance_val": "Vision Karnataka Foundation (VKF) DPR Guidance Framework",
        "decl_verif": "Verification Status:",
        "decl_verif_val": "Institutional Appraisal & Credit Bankability Verified",
        "decl_place": "Place:",
        "decl_date": "Date:",
        "decl_for": "For",
        "decl_signatory": "Authorized Signatory",
        "decl_end_note": "*** END OF DETAILED PROJECT REPORT — VISION KARNATAKA FOUNDATION ***",
        "sched_sub_heading": "FINANCIAL ANNEXURES & DETAILED SCHEDULE WORKSHEETS",
        "sched_sub_desc": "Below are the 10 bankable financial schedules supporting project appraisal, credit rating, and term loan sanction.",
        "sched1_title": "ANNEXURE SCHEDULE 1: DETAILED COST OF PROJECT & CAPITAL OUTLAY",
        "sched2_title": "ANNEXURE SCHEDULE 2: MEANS OF FINANCE & PROMOTER MARGIN",
        "sched3_title": "ANNEXURE SCHEDULE 3: PLANT & MACHINERY PROCUREMENT BREAKDOWN",
        "sched4_title": "ANNEXURE SCHEDULE 4: ORGANIZATIONAL MANPOWER WAGES & SALARY",
        "sched5_title": "ANNEXURE SCHEDULE 5: RAW MATERIAL BOQ SCHEDULE",
        "sched6_title": "ANNEXURE SCHEDULE 6: 10-YEAR PROJECTED PROFITABILITY STATEMENT",
        "sched7_title": "ANNEXURE SCHEDULE 7: 10-YEAR PROJECTED BALANCE SHEET STATEMENT",
        "sched8_title": "ANNEXURE SCHEDULE 8: 36-MONTH MONTHLY CASH FLOW WORKSHEET",
        "sched9_title": "ANNEXURE SCHEDULE 9: DEBT SERVICE COVERAGE RATIO (DSCR) WORKSHEET",
        "sched10_title": "ANNEXURE SCHEDULE 10: INCOME TAX ACT DEPRECIATION WORKSHEET",
        "th_particulars": "Particulars",
        "th_amount": "Amount (₹)",
        "th_qty": "Qty",
        "th_rate": "Rate (₹)",
        "th_total": "Total (₹)",
        "th_year": "Year",
        "th_y1": "Year 1",
        "th_y2": "Year 2",
        "th_y3": "Year 3",
        "th_y4": "Year 4",
        "th_y5": "Year 5",
        "th_member_name": "Member Name",
        "th_designation": "Designation",
        "th_gender_age": "Gender / Age",
        "th_qualification": "Qualification",
        "th_experience": "Experience",
        "th_machine_desc": "Machine / Equipment Description",
        "th_unit_price": "Unit Price (₹)",
        "th_total_cost": "Total Cost (₹)",
        "th_expenditure_head": "Project Expenditure Head",
        "th_pct_total": "% of Total",
        "th_total_project_cost": "TOTAL PROJECT COST",
        "th_total_manpower": "TOTAL MANPOWER",
        # General & Table Headers
        "th_parameter": "Parameter",
        "th_model_value": "Model Value",
        "th_role_category": "Role / Category",
        "th_personnel_count": "Personnel Count",
        "th_monthly_salary": "Monthly Salary (₹)",
        "th_monthly_total": "Monthly Total (₹)",
        "th_annual_total": "Annual Total (₹)",
        "th_holding_period": "Holding Period",
        "th_asset_block": "Asset Block",
        "th_depr_rate": "Depr Rate (%)",
        "th_fin_year": "Financial Year",
        "th_opening_balance": "Opening Balance (₹)",
        "th_principal_repay": "Principal Repayment (₹)",
        "th_interest_exp": "Interest Expense (₹)",
        "th_closing_balance": "Closing Balance (₹)",
        "th_mth": "Mth",
        "th_yr": "Yr",
        "th_revenue": "Revenue (₹)",
        "th_operating_costs": "Operating Costs (₹)",
        "th_pbdit": "PBDIT (₹)",
        "th_interest": "Interest (₹)",
        "th_depr": "Depr (₹)",
        "th_pat": "PAT (₹)",
        "th_dscr": "DSCR",
        "th_principal": "Principal (₹)",
        "th_closing_loan": "Closing Loan (₹)",
        "th_net_cash": "Net Cash (₹)",
        "th_raw_item": "Raw Material Item / Component",
        "th_unit": "Unit",
        "th_annual_qty": "Annual Qty Required",
        "th_unit_rate": "Unit Rate (₹)",
        "th_staff_category": "Staff Category",
        "th_no_personnel": "No. of Personnel",
        "th_monthly_salary_person": "Monthly Salary / Person (₹)",
        "th_component": "Component",
        "th_funding_source": "Funding Source",
        "th_pct_share": "% Share",
        "th_estimated_outlay": "Estimated Outlay (₹)",
        "th_liabilities_assets": "Liabilities / Assets",
        "th_debt_service": "Debt Service (₹)",
        "th_pillar": "Pillar",
        "th_details": "Details",
        "th_stat_reg": "Statutory Registration / Approval",
        "th_issuing_authority": "Issuing Authority",
        "th_compliance_status": "Compliance Status",
        "th_stress_scenario": "Stress Test Scenario",
        "th_proj_dscr": "Projected DSCR",
        "th_npv_impact": "NPV Impact (₹)",
        "th_viability_status": "Project Viability",
        "th_esg_dimension": "ESG & TCRM Dimension",
        "th_eval_rating": "Evaluation Rating",
        "th_key_measures": "Key Sustainability Measures",
        "th_wc_param": "Working Capital Assessment Parameter",
        "th_method1": "Method I (75% NWC Gap)",
        "th_method2": "Method II (75% Current Assets)",
        "th_corp_param": "Corporate Financial Parameter",
        "th_calc_val": "Calculated Value",
        "th_benchmark": "Corporate Benchmark",
        # Capex items
        "capex_land": "Land & Site Development",
        "capex_building": "Civil Works & Building Shed",
        "capex_machinery": "Plant, Machinery & Equipment",
        "capex_electrification": "Electrification & Utility Setup",
        "capex_furniture": "Furniture, Office & Fixtures",
        "capex_working_capital": "Working Capital Margin",
        "capex_preoperative": "Pre-operative Expenses & Contingency",
        "fin_promoter_equity": "Promoter Equity Capital",
        "fin_term_loan": "Term Loan / Debt Funding",
        "fin_subsidy": "Government Capital Subsidy",
        "fin_total": "TOTAL MEANS OF FINANCE",
        # Manpower items
        "mp_management": "Management & Technical Lead",
        "mp_supervisors": "Supervisory Staff & Engineers",
        "mp_skilled": "Skilled Operators & Technicians",
        "mp_unskilled": "Unskilled Helpers & Labourers",
        "mp_admin": "Administrative, Accounts & Sales",
        "lbl_total_manpower_req": "Total Manpower Requirement:",
        "lbl_monthly_wages_budget": "Monthly Wages Budget:",
        "lbl_persons": "Persons",
        # Assumptions
        "assump_capacity_day": "Assumed Installed Capacity per Day",
        "assump_working_days": "Working Days per Year",
        "assump_working_hours": "Working Hours per Day",
        "assump_capacity_util": "Capacity Utilization Profile",
        "assump_raw_cost": "Average Raw Material Cost per Unit",
        "assump_sale_price": "Average Sale Price per Unit",
        "assump_supplier": "Supplier Details:",
        "assump_location": "Location:",
        "assump_plant_mach_cost": "Plant & Machinery Cost:",
        "assump_plant_mach_inc": "(Includes automated machines and tools).",
        # SWOT
        "swot_strengths": "Strengths",
        "swot_weaknesses": "Weaknesses",
        "swot_opportunities": "Opportunities",
        "swot_threats": "Threats",
        "swot_strengths_default": "Modern automated machinery, skilled promoter team, strong regional demand.",
        "swot_weaknesses_default": "Initial capital intensive setup and market distribution network expansion.",
        "swot_opportunities_default": "Growing market demand, government subsidy support, and product expansion.",
        "swot_threats_default": "Raw material price fluctuations and competitive market entry.",
        # Financials & Statements
        "cf_cap_util": "Capacity Utilization (%)",
        "cf_gross_revenue": "Gross Revenue (A)",
        "cf_raw_opex": "Raw Material & Operating Cost (B)",
        "cf_pbdit": "Net Cash Flow / Profit Before Interest (A - B)",
        "cf_cash_avail": "Net Cash Flow Available",
        "cf_interest": "Interest Repayment",
        "cf_dscr": "Debt Service Coverage Ratio (DSCR)",
        "lbl_avg_dscr": "Average 5-Year DSCR:",
        "lbl_bep": "Break-Even Point:",
        "fin_viability_summary": "All projections confirm strong financial viability, high cash cushion, and absolute debt servicing security. The debt service coverage ratio comfortably exceeds bank lending benchmarks (1.50).",
        # Tandon Working Capital
        "tan_rm_stock": "Raw Material Stock Holding",
        "tan_wip": "Work-in-Process (WIP) Inventory",
        "tan_fg": "Finished Goods Inventory",
        "tan_debtors": "Trade Receivables / Debtors",
        "tan_gross_wc": "Gross Working Capital Requirement",
        "tan_less_creditors": "Less: Trade Creditors / Raw Material Credit",
        "tan_nwc": "Net Working Capital Gap (NWC)",
        "tan_promoter_margin": "Promoter Working Capital Margin (25%)",
        "tan_bank_cc": "Assessed Bank Cash Credit / Working Capital Limit (75%)",
        "tan_gross_ca": "Gross Projected Current Assets (CA)",
        "tan_less_cl": "Less: Current Liabilities (CL)",
        "tan_min_promoter_margin": "Minimum Promoter NWC Margin (25%)",
        "tan_mpbf": "Maximum Permissible Bank Finance (MPBF)",
        # Depreciation
        "dep_building": "Building & Civil Works",
        "dep_machinery": "Plant & Machinery Equipment",
        "dep_electrification": "Electrification & Utility Setup",
        "dep_furniture": "Furniture, Office & Fixtures",
        "dep_total": "TOTAL ANNUAL DEPRECIATION ALLOWANCE",
        # Amortization
        "amort_text": "Term loan repayment is structured over 5 years following a 6-month moratorium period at an annual interest rate of 10.0% per annum.",
        # Land & Site
        "land_desc": "The manufacturing facility is located in a designated industrial zone with adequate logistics access for heavy transport vehicles.",
        # Soft Intervention
        "soft_desc": "Soft intervention plays a pivotal role in transitioning raw micro-enterprises into commercially sustainable industrial units. Under the VKF framework, structured capacity building modules are deployed in collaboration with regional institutes including CEDOK and RUDSETI.",
        # Statutory
        "stat_gst": "GST Registration",
        "stat_udyam": "Udyam MSME Registration",
        "stat_pcb": "Consent to Establish (CTE / CTO)",
        "stat_trade": "Trade License / Factory License",
        "stat_tax_dept": "Commercial Tax Department",
        "stat_msme_min": "Ministry of MSME",
        "stat_pcb_board": "State Pollution Control Board",
        "stat_munc": "Local Municipal Corporation",
        "stat_registered": "Registered",
        "stat_applied": "Applied / Granted",
        "stat_active": "Active / In Progress",
        # Schedules
        "sch_total_capex": "TOTAL PROJECT CAPITAL OUTLAY",
        "sch_total_means": "TOTAL MEANS OF FINANCE",
        "sch_total_machinery": "TOTAL MACHINERY INVESTMENT",
        "sch_reserves_surplus": "Reserves & Surplus (Accumulated PAT)",
        "sch_term_loan_out": "Term Loan Outstanding",
        "lbl_image_product": "Product Specification Visual",
        "lbl_image_facility": "Plant Equipment & Machinery Layout",
        "lbl_image_team": "Quality Assurance & Staffing Profile",
    },
    "kn": {
        "dpr_cover_title": "ವಿವರವಾದ ಯೋಜನಾ ವರದಿ (DPR)",
        "manufacturing_unit": "ಉತ್ಪಾದನಾ ಘಟಕ",
        "by_vkf": "ವಿಷನ್ ಕರ್ನಾಟಕ ಫೌಂಡೇಶನ್ ವತಿಯಿಂದ",
        "lbl_enterprise_name": "ಉದ್ಯಮದ ಹೆಸರು:",
        "lbl_service_type": "DPR ಸೇವಾ ಪ್ರಕಾರ:",
        "lbl_quality_tier": "ವರದಿಯ ಗುಣಮಟ್ಟ ಶ್ರೇಣಿ:",
        "lbl_financial_horizon": "ಹಣಕಾಸು ಯೋಜನಾ ಅವಧಿ:",
        "lbl_legal_constitution": "ಕಾನೂನು ಪ್ರಕಾರ:",
        "lbl_district_state": "ಜಿಲ್ಲೆ ಮತ್ತು ರಾಜ್ಯ:",
        "lbl_total_cost": "ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ:",
        "lbl_bank_loan": "ಅಗತ್ಯವಿರುವ ಬ್ಯಾಂಕ್ ಸಾಲ:",
        "lbl_promoter_equity": "ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ ಬಂಡವಾಳ:",
        "toc_title": "ವಿಷಯ ಸೂಚಿ (ಪರಿವಿಡಿ)",
        "th_sl_no": "ಕ್ರ.ಸಂ",
        "th_content_section": "ವಿಷಯ ವಿಭಾಗ",
        "th_page_no": "ಪುಟ ಸಂಖ್ಯೆ",
        "toc_sec1": "ಜೆಎಲ್‌ಜಿ / ಉದ್ಯಮ ಸದಸ್ಯರ ವಿವರ",
        "toc_sec2": "ಎಸ್‌ವಿಎಸ್‌ವೈ ಮತ್ತು ಯುವಶಕ್ತಿ ಚೌಕಟ್ಟಿನ ಉದ್ದೇಶಗಳು",
        "toc_sec3": "ವಿಷನ್ ಕರ್ನಾಟಕ ಫೌಂಡೇಶನ್ (VKF) ಕುರಿತು",
        "toc_sec4": "ಉತ್ಪನ್ನದ ಹೆಸರು ಮತ್ತು ತಂತ್ರಜ್ಞಾನ",
        "toc_sec5": "ಉತ್ಪನ್ನದ ವಿತರಣೆಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ",
        "toc_sec6": "ಪ್ರತಿಯೊಬ್ಬ ಸದಸ್ಯರ ಪಾತ್ರ ಮತ್ತು ಸಿಬ್ಬಂದಿ ಶ್ರೇಣಿ",
        "toc_sec7": "ಸಾಮರ್ಥ್ಯ ವೃದ್ಧಿ ಮತ್ತು ತರಬೇತಿ",
        "toc_sec8": "ಅಂದಾಜು ಯೋಜನಾ ವೆಚ್ಚ ಮತ್ತು ಅನುಷ್ಠಾನ ವೇಳಾಪಟ್ಟಿ",
        "toc_sec9": "ಜಮೀನು / ಶೆಡ್ ಮೂಲಸೌಕರ್ಯ ಸ್ಥಿತಿ",
        "toc_sec10": "ಸ್ವಾಟ್ (SWOT) ವಿಶ್ಲೇಷಣೆ",
        "toc_sec11": "ಯುವ ಸಬಲೀಕರಣ ಮತ್ತು ಪರಿಸರ ವ್ಯವಸ್ಥೆಯ ಮೇಲಿನ ಪರಿಣಾಮ",
        "toc_sec12": "ಸಿದ್ಧ ಉತ್ಪನ್ನಗಳು (ಚಿತ್ರ ಗ್ಯಾಲರಿ)",
        "toc_sec13": "ಹಣಕಾಸು ಮತ್ತು ಸಾಲ ಮರುಪಾವತಿ ವೇಳಾಪಟ್ಟಿ",
        "sec1_title": "1. ಜೆಎಲ್‌ಜಿ / ಉದ್ಯಮ ಸದಸ್ಯರ ಅವಲೋಕನ",
        "sec1_sub": "ಶ್ರೇಣಿಯೊಂದಿಗೆ ಸದಸ್ಯರ ವಿವರಗಳು:",
        "sec1_lbl_name": "ಉದ್ಯಮದ ಹೆಸರು / ಜೆಎಲ್‌ಜಿ:",
        "sec1_lbl_group": "ಗುಂಪು / ಪ್ರವರ್ತಕರ ಹೆಸರು:",
        "sec1_lbl_gp": "ಗ್ರಾಮ ಪಂಚಾಯತ್ / ತಾಲೂಕು:",
        "sec1_lbl_dist": "ಜಿಲ್ಲೆ ಮತ್ತು ರಾಜ್ಯ:",
        "sec1_lbl_bank": "ಖಾತೆ ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳು:",
        "sec1_lbl_udyam": "ಉದ್ಯಮ್ / ಜಿಎಸ್‌ಟಿ / ಸಿಬಿಲ್:",
        "sec2_title": "2. ಎಸ್‌ವಿಎಸ್‌ವೈ ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಪ್ರೊಫೈಲ್‌ನ ಉದ್ದೇಶಗಳು",
        "sec3_title": "3. ಮ್ಯಾಕ್ರೋ-ಆರ್ಥಿಕ ಪರಿಸರ ಮತ್ತು ಯೋಜನಾ ಹಿನ್ನೆಲೆ",
        "sec4_title": "4. ಉತ್ಪನ್ನದ ಹೆಸರು ಮತ್ತು ತಂತ್ರಜ್ಞಾನ",
        "sec5_title": "5. ಉತ್ಪನ್ನದ ವಿತರಣೆಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಸಂಭಾವ್ಯತೆ",
        "sec5_sub_assump": "ವಿವರವಾದ ಯೋಜನಾ ಊಹೆಗಳ ಕೋಷ್ಟಕ:",
        "sec5_sub_mach": "ಸ್ಥಾವರ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳ ವಿವರ:",
        "sec6_title": "6. ಸದಸ್ಯರ ಪಾತ್ರ, ಸಿಬ್ಬಂದಿ ಶ್ರೇಣಿ ಮತ್ತು ತಾಂತ್ರಿಕ ಕಾರ್ಯಸಾಧ್ಯತೆ",
        "sec7_title": "7. ಸಾಮರ್ಥ್ಯ ವೃದ್ಧಿ ಮತ್ತು ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ",
        "sec8_title": "8. ಅಂದಾಜು ಯೋಜನಾ ವೆಚ್ಚ ಮತ್ತು ಅನುಷ್ಠಾನ ವೇಳಾಪಟ್ಟಿ",
        "sec8_sub_charts": "ಬಂಡವಾಳ ವೆಚ್ಚ ಮತ್ತು ಹಣಕಾಸು ಮೂಲಗಳ ನಕ್ಷೆಗಳು",
        "sec9_title": "9. ಜಮೀನು ಮತ್ತು ಮೂಲಸೌಕರ್ಯ ಸ್ಥಿತಿ",
        "sec10_title": "10. ಸ್ವಾಟ್ (SWOT) ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಕಾರ್ಯತಂತ್ರ",
        "sec11_title": "11. ಯುವ ಸಬಲೀಕರಣ ಮತ್ತು ಪರಿಸರದ ಮೇಲಿನ ಪರಿಣಾಮ",
        "sec12_title": "12. ಅಂತಿಮ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಗುಣಮಟ್ಟ ಖಾತರಿ",
        "sec13_title": "13. ಹಣಕಾಸು ಮತ್ತು ಅಂದಾಜುಗಳು",
        "sec13_sub_cashflow": "5-ವರ್ಷಗಳ ನಗದು ಹರಿವಿನ ಹೇಳಿಕೆ (₹)",
        "sec13_sub_dscr": "ಅಂದಾಜು ಸಾಲ ಮರುಪಾವತಿ (DSCR) ಹೇಳಿಕೆ",
        "sec13_sub_charts": "ಹಣಕಾಸು ಅಂದಾಜುಗಳು ಮತ್ತು DSCR ಅನುಪಾತ ನಕ್ಷೆಗಳು",
        "sec13_sub_val": "ಸುಧಾರಿತ ಕಾರ್ಪೊರೇಟ್ ಹಣಕಾಸು ಮೌಲ್ಯಮಾಪನ (DCF & IRR)",
        "sec13_sub_sens": "ವಿವಿಧ ಸನ್ನಿವೇಶಗಳ ಸೂಕ್ಷ್ಮತೆ ವಿಶ್ಲೇಷಣೆ",
        "sec13_sub_esg": "ಇಎಸ್‌ಜಿ (ಪರಿಸರ, ಸಾಮಾಜಿಕ ಮತ್ತು ಆಡಳಿತ) ಸ್ಕೋರ್‌ಕಾರ್ಡ್",
        "sec14_title": "14. ದುಡಿಯುವ ಬಂಡವಾಳ ಮೌಲ್ಯಮಾಪನ (ಟಂಡನ್ ಸಮಿತಿ ನಿಯಮಗಳು)",
        "sec15_title": "15. ಸವಕಳಿ ವೇಳಾಪಟ್ಟಿ (ಆದಾಯ ತೆರಿಗೆ ಕಾಯ್ದೆ 1961)",
        "sec16_title": "16. ಅವಧಿ ಸಾಲ ಮರುಪಾವತಿ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ಸನ್ನದ್ಧತೆ",
        "sec17_title": "17. 10-ವರ್ಷಗಳ ವಿಸ್ತೃತ ಲಾಭ-ನಷ್ಟ ಹೇಳಿಕೆ (P&L)",
        "sec18_title": "18. 36-ತಿಂಗಳುಗಳ ವಿವರವಾದ ಮಾಸಿಕ ನಗದು ಹರಿವು",
        "sec19_title": "19. ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬಿಲ್ ಆಫ್ ಕ್ವಾಂಟಿಟೀಸ್ (BOQ) ಮತ್ತು ಖರೀದಿ",
        "sec20_title": "20. ಸಿಬ್ಬಂದಿ ಹುದ್ದೆ ಮತ್ತು ವೇತನ ವಿವರ",
        "sec21_title": "21. ಟಂಡನ್ ಮತ್ತು ನಾಯಕ್ ಸಮಿತಿ ದುಡಿಯುವ ಬಂಡವಾಳ ನಿಯಮಗಳು",
        "sec22_title": "22. ತಂತ್ರಜ್ಞಾನ ವಾಣಿಜ್ಯೀಕರಣ ಮತ್ತು ಸನ್ನದ್ಧತೆ ಆಡಿಟ್",
        "sec23_title": "23. ಇಎಸ್‌ಜಿ ಮತ್ತು ಪರಿಸರ ಸುಸ್ಥಿರತೆ ಸ್ಕೋರ್‌ಕಾರ್ಡ್",
        "sec24_title": "24. ಮಲ್ಟಿ-ಸನ್ನಿವೇಶ ಸೂಕ್ಷ್ಮತೆ ಮತ್ತು ಒತ್ತಡ ಪರೀಕ್ಷೆ ವಿಶ್ಲೇಷಣೆ",
        "sec25_title": "25. ಸ್ವಾಟ್ (SWOT) ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪ್ರತಿಸ್ಪರ್ಧಿ ಹೋಲಿಕೆ",
        "sec26_title": "26. ಅನ್ವಯವಾಗುವ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸಬ್ಸಿಡಿ ಯೋಜನೆಗಳು",
        "sec27_title": "27. ನಿವೇಶನ ಮೂಲಸೌಕರ್ಯ, ವಿದ್ಯುತ್ ಮತ್ತು ಉಪಯುಕ್ತತೆಗಳು",
        "sec28_title": "28. ಮಾರುಕಟ್ಟೆ, ಬ್ರ್ಯಾಂಡಿಂಗ್ ಮತ್ತು ವಿತರಣಾ ಕಾರ್ಯತಂತ್ರ",
        "sec29_title": "29. ಶಾಸನಬದ್ಧ ಅನುಸರಣೆಗಳು, ಪರವಾನಗಿಗಳು ಮತ್ತು ಅನುಮೋದನೆಗಳ ಪಟ್ಟಿ",
        "sec30_title": "30. ಬ್ಯಾಂಕ್ ಸಾಲ ಶಿಫಾರಸು ಮತ್ತು ಮುಕ್ತಾಯ",
        "sec31_title": "31. ಘೋಷಣೆ ಮತ್ತು ಅಧಿಕೃತ ಸಹಿ",
        "decl_text": "ಈ ವಿವರವಾದ ಯೋಜನಾ ವರದಿಯಲ್ಲಿ (DPR) ಪ್ರಸ್ತುತಪಡಿಸಲಾದ ಎಲ್ಲಾ ಮಾಹಿತಿ ಮತ್ತು ಹಣಕಾಸಿನ ಅಂದಾಜುಗಳು ನನ್ನ/ನಮ್ಮ ಜ್ಞಾನ ಮತ್ತು ನಂಬಿಕೆಗೆ ತಕ್ಕಂತೆ ಸತ್ಯ ಮತ್ತು ಸರಿಯಾಗಿದೆ ಎಂದು ನಾನು/ನಾವು ಈ ಮೂಲಕ ದೃಢೀಕರಿಸುತ್ತೇವೆ. ಸಾಲ ಮಂಜೂರಾತಿಗಾಗಿ ವಾಸ್ತವಿಕ ಕಾರ್ಯಾಚರಣಾ ನಿಯತಾಂಕಗಳ ಆಧಾರದ ಮೇಲೆ ಎಲ್ಲಾ ಹಣಕಾಸಿನ ಮುನ್ನೋಟಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.",
        "decl_doc_ref": "ದಾಖಲೆ ಉಲ್ಲೇಖ:",
        "decl_guidance": "ಮಾರ್ಗದರ್ಶನದ ಅಡಿಯಲ್ಲಿ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ:",
        "decl_guidance_val": "ವಿಷನ್ ಕರ್ನಾಟಕ ಫೌಂಡೇಶನ್ (VKF) DPR ಮಾರ್ಗದರ್ಶನ ಚೌಕಟ್ಟು",
        "decl_verif": "ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ:",
        "decl_verif_val": "ಸಾಂಸ್ಥಿಕ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಕ್ರೆಡಿಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಅರ್ಹತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
        "decl_place": "ಸ್ಥಳ:",
        "decl_date": "ದಿನಾಂಕ:",
        "decl_for": "ಇವರಿಗಾಗಿ",
        "decl_signatory": "ಅಧಿಕೃತ ಸಹಿದಾರರು",
        "decl_end_note": "*** ವಿವರವಾದ ಯೋಜನಾ ವರದಿ ಮುಕ್ತಾಯ — ವಿಷನ್ ಕರ್ನಾಟಕ ಫೌಂಡೇಶನ್ ***",
        "sched_sub_heading": "ಹಣಕಾಸು ಅನುಬಂಧಗಳು ಮತ್ತು ವಿವರವಾದ ವೇಳಾಪಟ್ಟಿ ಕಾರ್ಯಹಾಳೆಗಳು",
        "sched_sub_desc": "ಯೋಜನಾ ಮೌಲ್ಯಮಾಪನ, ಕ್ರೆಡಿಟ್ ರೇಟಿಂಗ್ ಮತ್ತು ಸಾಲ ಮಂಜೂರಾತಿಯನ್ನು ಬೆಂಬಲಿಸುವ 10 ಬ್ಯಾಂಕೇಬಲ್ ಹಣಕಾಸು ವೇಳಾಪಟ್ಟಿಗಳು ಕೆಳಕಂಡಂತಿವೆ.",
        "sched1_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 1: ವಿವರವಾದ ಯೋಜನಾ ವೆಚ್ಚ ಮತ್ತು ಬಂಡವಾಳ ಹೂಡಿಕೆ",
        "sched2_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 2: ಹಣಕಾಸು ಮೂಲಗಳು ಮತ್ತು ಪ್ರವರ್ತಕರ ಮಾರ್ಜಿನ್",
        "sched3_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 3: ಸ್ಥಾವರ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳ ಖರೀದಿ ವಿವರ",
        "sched4_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 4: ಸಾಂಸ್ಥಿಕ ಸಿಬ್ಬಂದಿ ವೇತನ ಮತ್ತು ಭತ್ಯೆಗಳು",
        "sched5_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 5: ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬಿಲ್ ಆಫ್ ಕ್ವಾಂಟಿಟೀಸ್ (BOQ)",
        "sched6_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 6: 10-ವರ್ಷಗಳ ಅಂದಾಜು ಲಾಭದಾಯಕತೆ ಹೇಳಿಕೆ",
        "sched7_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 7: 10-ವರ್ಷಗಳ ಅಂದಾಜು ಆಸ್ತಿ-ಹೊಣೆಗಾರಿಕೆ ಹೇಳಿಕೆ (ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್)",
        "sched8_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 8: 36-ತಿಂಗಳುಗಳ ಮಾಸಿಕ ನಗದು ಹರಿವಿನ ಕಾರ್ಯಹಾಳೆ",
        "sched9_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 9: ಸಾಲ ಮರುಪಾವತಿ ಸಾಮರ್ಥ್ಯ (DSCR) ಹೇಳಿಕೆ",
        "sched10_title": "ಅನುಬಂಧ ವೇಳಾಪಟ್ಟಿ 10: ಆದಾಯ ತೆರಿಗೆ ಕಾಯ್ದೆ ಸವಕಳಿ ಲೆಕ್ಕಾಚಾರ",
        "th_particulars": "ವಿವರಗಳು",
        "th_amount": "ಮೊತ್ತ (₹)",
        "th_qty": "ಪ್ರಮಾಣ",
        "th_rate": "ದರ (₹)",
        "th_total": "ಒಟ್ಟು (₹)",
        "th_year": "ವರ್ಷ",
        "th_y1": "ವರ್ಷ 1",
        "th_y2": "ವರ್ಷ 2",
        "th_y3": "ವರ್ಷ 3",
        "th_y4": "ವರ್ಷ 4",
        "th_y5": "ವರ್ಷ 5",
        "th_member_name": "ಸದಸ್ಯರ ಹೆಸರು",
        "th_designation": "ಹುದ್ದೆ",
        "th_gender_age": "ಲಿಂಗ / ವಯಸ್ಸು",
        "th_qualification": "ವಿದ್ಯಾರ್ಹತೆ",
        "th_experience": "ಅನುಭವ",
        "th_machine_desc": "ಯಂತ್ರ / ಉಪಕರಣದ ವಿವರಣೆ",
        "th_unit_price": "ಘಟಕ ದರ (₹)",
        "th_total_cost": "ಒಟ್ಟು ವೆಚ್ಚ (₹)",
        "th_expenditure_head": "ಯೋಜನಾ ವೆಚ್ಚದ ಶೀರ್ಷಿಕೆ",
        "th_pct_total": "ಒಟ್ಟು ಮೊತ್ತದ %",
        "th_total_project_cost": "ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ",
        "th_total_manpower": "ಒಟ್ಟು ಸಿಬ್ಬಂದಿ",
        # General & Table Headers
        "th_parameter": "ನಿಯತಾಂಕ",
        "th_model_value": "ಮೌಲ್ಯ",
        "th_role_category": "ಹುದ್ದೆ / ವರ್ಗ",
        "th_personnel_count": "ಸಿಬ್ಬಂದಿ ಸಂಖ್ಯೆ",
        "th_monthly_salary": "ಮಾಸಿಕ ವೇತನ (₹)",
        "th_monthly_total": "ಮಾಸಿಕ ಒಟ್ಟು (₹)",
        "th_annual_total": "ವಾರ್ಷಿಕ ಒಟ್ಟು (₹)",
        "th_holding_period": "ಧಾರಣ ಅವಧಿ",
        "th_asset_block": "ಆಸ್ತಿ ವಿಭಾಗ",
        "th_depr_rate": "ಸವಕಳಿ ದರ (%)",
        "th_fin_year": "ಹಣಕಾಸು ವರ್ಷ",
        "th_opening_balance": "ಆರಂಭಿಕ ಬಾಕಿ (₹)",
        "th_principal_repay": "ಅಸಲು ಮರುಪಾವತಿ (₹)",
        "th_interest_exp": "ಬಡ್ಡಿ ವೆಚ್ಚ (₹)",
        "th_closing_balance": "ಅಂತಿಮ ಬಾಕಿ (₹)",
        "th_mth": "ತಿಂಗಳು",
        "th_yr": "ವರ್ಷ",
        "th_revenue": "ಆದಾಯ (₹)",
        "th_operating_costs": "ಕಾರ್ಯಾಚರಣೆ ವೆಚ್ಚ (₹)",
        "th_pbdit": "PBDIT (₹)",
        "th_interest": "ಬಡ್ಡಿ (₹)",
        "th_depr": "ಸವಕಳಿ (₹)",
        "th_pat": "ನಿವ್ವಳ ಲಾಭ PAT (₹)",
        "th_dscr": "DSCR ಅನುಪಾತ",
        "th_principal": "ಅಸಲು (₹)",
        "th_closing_loan": "ಬಾಕಿ ಸಾಲ (₹)",
        "th_net_cash": "ನಿವ್ವಳ ನಗದು (₹)",
        "th_raw_item": "ಕಚ್ಚಾ ಸಾಮಗ್ರಿ / ಘಟಕ",
        "th_unit": "ಪ್ರಮಾಣ ಘಟಕ",
        "th_annual_qty": "ವಾರ್ಷಿಕ ಅಗತ್ಯ ಪ್ರಮಾಣ",
        "th_unit_rate": "ಘಟಕ ದರ (₹)",
        "th_staff_category": "ಸಿಬ್ಬಂದಿ ವರ್ಗ",
        "th_no_personnel": "ಸಿಬ್ಬಂದಿ ಸಂಖ್ಯೆ",
        "th_monthly_salary_person": "ಮಾಸಿಕ ವೇತನ / ವ್ಯಕ್ತಿ (₹)",
        "th_component": "ಅಂಶ",
        "th_funding_source": "ಹಣಕಾಸಿನ ಮೂಲ",
        "th_pct_share": "% ಪಾಲು",
        "th_estimated_outlay": "ಅಂದಾಜು ವೆಚ್ಚ (₹)",
        "th_liabilities_assets": "ಹೊಣೆಗಾರಿಕೆಗಳು / ಆಸ್ತಿಗಳು",
        "th_debt_service": "ಸಾಲ ಸೇವೆ (₹)",
        "th_pillar": "ವಿಭಾಗ",
        "th_details": "ವಿವರಗಳು",
        "th_stat_reg": "ಶಾಸನಬದ್ಧ ನೋಂದಣಿ / ಅನುಮೋದನೆ",
        "th_issuing_authority": "ನೀಡುವ ಪ್ರಾಧಿಕಾರ",
        "th_compliance_status": "ಅನುಸರಣಾ ಸ್ಥಿತಿ",
        "th_stress_scenario": "ಒತ್ತಡ ಪರೀಕ್ಷೆ ಸನ್ನಿವೇಶ",
        "th_proj_dscr": "ಅಂದಾಜು DSCR",
        "th_npv_impact": "NPV ಪರಿಣಾಮ (₹)",
        "th_viability_status": "ಯೋಜನೆಯ ಅರ್ಹತೆ",
        "th_esg_dimension": "ಇಎಸ್‌ಜಿ ಮತ್ತು ಟಿಸಿಆರ್‌ಎಂ ಆಯಾಮ",
        "th_eval_rating": "ಮೌಲ್ಯಮಾಪನ ರೇಟಿಂಗ್",
        "th_key_measures": "ಪ್ರಮುಖ ಸುಸ್ಥಿರ ಕ್ರಮಗಳು",
        "th_wc_param": "ದುಡಿಯುವ ಬಂಡವಾಳ ನಿಯತಾಂಕ",
        "th_method1": "ವಿಧಾನ I (75% NWC ಅಂತರ)",
        "th_method2": "ವಿಧಾನ II (75% ಚಾಲ್ತಿ ಆಸ್ತಿಗಳು)",
        "th_corp_param": "ಕಾರ್ಪೊರೇಟ್ ಹಣಕಾಸು ನಿಯತಾಂಕ",
        "th_calc_val": "ಲೆಕ್ಕಹಾಕಿದ ಮೌಲ್ಯ",
        "th_benchmark": "ಮಾನದಂಡ",
        # Capex items
        "capex_land": "ಜಮೀನು ಮತ್ತು ನಿವೇಶನ ಅಭಿವೃದ್ಧಿ",
        "capex_building": "ಸಿವಿಲ್ ಕಾಮಗಾರಿ ಮತ್ತು ಕಟ್ಟಡ ಶೆಡ್",
        "capex_machinery": "ಸ್ಥಾವರ, ಯಂತ್ರೋಪಕರಣ ಮತ್ತು ಉಪಕರಣಗಳು",
        "capex_electrification": "ವಿದ್ಯುದೀಕರಣ ಮತ್ತು ಯುಟಿಲಿಟಿ ವ್ಯವಸ್ಥೆ",
        "capex_furniture": "ಪೀಠೋಪಕರಣಗಳು, ಕಚೇರಿ ಮತ್ತು ಫಿಕ್ಚರ್‌ಗಳು",
        "capex_working_capital": "ದುಡಿಯುವ ಬಂಡವಾಳ ಮಾರ್ಜಿನ್ ಹಣ",
        "capex_preoperative": "ಪೂರ್ವ-ಕಾರ್ಯಾಚರಣಾ ವೆಚ್ಚ ಮತ್ತು ಅನಿಶ್ಚಿತತೆ",
        "fin_promoter_equity": "ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ ಬಂಡವಾಳ",
        "fin_term_loan": "ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲ",
        "fin_subsidy": "ಸರ್ಕಾರಿ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ",
        "fin_total": "ಒಟ್ಟು ಹಣಕಾಸಿನ ಮೂಲಗಳು",
        # Manpower items
        "mp_management": "ನಿರ್ವಹಣೆ ಮತ್ತು ತಾಂತ್ರಿಕ ನಾಯಕತ್ವ",
        "mp_supervisors": "ಮೇಲ್ವಿಚಾರಣಾ ಸಿಬ್ಬಂದಿ ಮತ್ತು ಎಂಜಿನಿಯರ್‌ಗಳು",
        "mp_skilled": "ನುರಿತ ನಿರ್ವಾಹಕರು ಮತ್ತು ತಂತ್ರಜ್ಞರು",
        "mp_unskilled": "ಅರೆ-ನುರಿತ / ಸಹಾಯಕ ಸಿಬ್ಬಂದಿ",
        "mp_admin": "ಆಡಳಿತ, ಲೆಕ್ಕಪತ್ರ ಮತ್ತು ಮಾರಾಟ ಸಿಬ್ಬಂದಿ",
        "lbl_total_manpower_req": "ಒಟ್ಟು ಅಗತ್ಯ ಸಿಬ್ಬಂದಿ ಸಂಖ್ಯೆ:",
        "lbl_monthly_wages_budget": "ಮಾಸಿಕ ವೇತನ ಬಜೆಟ್:",
        "lbl_persons": "ವ್ಯಕ್ತಿಗಳು",
        # Assumptions
        "assump_capacity_day": "ದೈನಂದಿನ ಸ್ಥಾಪಿತ ಸಾಮರ್ಥ್ಯ",
        "assump_working_days": "ವರ್ಷಕ್ಕೆ ಕೆಲಸದ ದಿನಗಳು",
        "assump_working_hours": "ದೈನಂದಿನ ಕೆಲಸದ ಅವಧಿ",
        "assump_capacity_util": "ಸಾಮರ್ಥ್ಯ ಬಳಕೆಯ ವಿವರ",
        "assump_raw_cost": "ಪ್ರತಿ ಘಟಕಕ್ಕೆ ಸರಾಸರಿ ಕಚ್ಚಾ ವಸ್ತು ವೆಚ್ಚ",
        "assump_sale_price": "ಪ್ರತಿ ಘಟಕಕ್ಕೆ ಸರಾಸರಿ ಮಾರಾಟ ದರ",
        "assump_supplier": "ಪೂರೈಕೆದಾರರ ವಿವರಗಳು:",
        "assump_location": "ಸ್ಥಳ:",
        "assump_plant_mach_cost": "ಸ್ಥಾವರ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳ ವೆಚ್ಚ:",
        "assump_plant_mach_inc": "(ಸ್ವಯಂಚಾಲಿತ ಯಂತ್ರಗಳು ಮತ್ತು ಉಪಕರಣಗಳನ್ನು ಒಳಗೊಂಡಿದೆ).",
        # SWOT
        "swot_strengths": "ಸಾಮರ್ಥ್ಯಗಳು (Strengths)",
        "swot_weaknesses": "ದೌರ್ಬಲ್ಯಗಳು (Weaknesses)",
        "swot_opportunities": "ಅವಕಾಶಗಳು (Opportunities)",
        "swot_threats": "ಸವಾಲುಗಳು (Threats)",
        "swot_strengths_default": "ಅತ್ಯಾಧುನಿಕ ಸ್ವಯಂಚಾಲಿತ ಯಂತ್ರೋಪಕರಣಗಳು, ಅನುಭವಿ ಪ್ರವರ್ತಕರು, ಪ್ರಾದೇಶಿಕ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಭಾರಿ ಬೇಡಿಕೆ.",
        "swot_weaknesses_default": "ಆರಂಭಿಕ ಹಂತದ ಬಂಡವಾಳ ಹೂಡಿಕೆ ಮತ್ತು ಮಾರಾಟ ಜಾಲದ ವಿಸ್ತರಣೆಯ ಅಗತ್ಯತೆ.",
        "swot_opportunities_default": "ಬೆಳೆಯುತ್ತಿರುವ ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ, ಸರ್ಕಾರದ PMEGP/PMFME ಸಬ್ಸಿಡಿ ಪ್ರೋತ್ಸಾಹ, ಉತ್ಪನ್ನ ವೈವಿಧ್ಯೀಕರಣ.",
        "swot_threats_default": "ಕಚ್ಚಾ ವಸ್ತುಗಳ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಏರಿಳಿತ ಮತ್ತು ಸ್ಥಳೀಯ ಪೈಪೋಟಿ.",
        # Financials & Statements
        "cf_cap_util": "ಸಾಮರ್ಥ್ಯ ಬಳಕೆ (%)",
        "cf_gross_revenue": "ಒಟ್ಟು ಆದಾಯ (A)",
        "cf_raw_opex": "ಕಚ್ಚಾ ಸಾಮಗ್ರಿ ಮತ್ತು ಕಾರ್ಯಾಚರಣೆ ವೆಚ್ಚ (B)",
        "cf_pbdit": "ನಿವ್ವಳ ನಗದು ಹರಿವು / ಬಡ್ಡಿಗೆ ಮುನ್ನ ಲಾಭ (A - B)",
        "cf_cash_avail": "ಲಭ್ಯವಿರುವ ನಿವ್ವಳ ನಗದು ಹರಿವು",
        "cf_interest": "ಬಡ್ಡಿ ಮರುಪಾವತಿ",
        "cf_dscr": "ಸಾಲ ಸೇವಾ ವ್ಯಾಪ್ತಿ ಅನುಪಾತ (DSCR)",
        "lbl_avg_dscr": "5-ವರ್ಷಗಳ ಸರಾಸರಿ DSCR:",
        "lbl_bep": "ಬ್ರೇಕ್-ಈವನ್ ಪಾಯಿಂಟ್:",
        "fin_viability_summary": "ಎಲ್ಲಾ ಹಣಕಾಸಿನ ಮುನ್ನೋಟಗಳು ಸದೃಢ ಆರ್ಥಿಕ ಕಾರ್ಯಸಾಧ್ಯತೆ, ಉತ್ತಮ ನಗದು ಸುರಕ್ಷತೆ ಮತ್ತು ಸಂಪೂರ್ಣ ಸಾಲ ಮರುಪಾವತಿ ಸಾಮರ್ಥ್ಯವನ್ನು ದೃಢೀಕರಿಸುತ್ತವೆ. ಸರಾಸರಿ DSCR ಅನುಪಾತವು ಬ್ಯಾಂಕಿಂಗ್ ಮಾನದಂಡವಾದ 1.50x ಗಿಂತ ಅಧಿಕವಾಗಿದೆ.",
        # Tandon Working Capital
        "tan_rm_stock": "ಕಚ್ಚಾ ವಸ್ತುಗಳ ದಾಸ್ತಾನು",
        "tan_wip": "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿರುವ ವಸ್ತುಗಳ ದಾಸ್ತಾನು (WIP)",
        "tan_fg": "ಸಿದ್ಧ ಸರಕುಗಳ ದಾಸ್ತಾನು",
        "tan_debtors": "ವ್ಯಾಪಾರ ಬಾಕಿಗಳು / ಗ್ರಾಹಕರ ಸಾಲ (Debtors)",
        "tan_gross_wc": "ಒಟ್ಟು ಅಗತ್ಯ ದುಡಿಯುವ ಬಂಡವಾಳ",
        "tan_less_creditors": "ಕಳೆಯಿರಿ: ಪೂರೈಕೆದಾರರ ಸಾಲ (Creditors)",
        "tan_nwc": "ನಿವ್ವಳ ದುಡಿಯುವ ಬಂಡವಾಳದ ಅಂತರ (NWC)",
        "tan_promoter_margin": "ಪ್ರವರ್ತಕರ ದುಡಿಯುವ ಬಂಡವಾಳ ಮಾರ್ಜಿನ್ (25%)",
        "tan_bank_cc": "ಅಂದಾಜು ಬ್ಯಾಂಕ್ ನಗದು ಸಾಲ / CC ಮಿತಿ (75%)",
        "tan_gross_ca": "ಒಟ್ಟು ಅಂದಾಜು ಚಾಲ್ತಿ ಆಸ್ತಿಗಳು (CA)",
        "tan_less_cl": "ಕಳೆಯಿರಿ: ಚಾಲ್ತಿ ಹೊಣೆಗಾರಿಕೆಗಳು (CL)",
        "tan_min_promoter_margin": "ಕನಿಷ್ಠ ಪ್ರವರ್ತಕರ NWC ಮಾರ್ಜಿನ್ (25%)",
        "tan_mpbf": "ಗರಿಷ್ಠ ಅನುಮತಿಸಬಹುದಾದ ಬ್ಯಾಂಕ್ ಸಾಲ (MPBF)",
        # Depreciation
        "dep_building": "ಕಟ್ಟಡ ಮತ್ತು ಸಿವಿಲ್ ಕಾಮಗಾರಿ",
        "dep_machinery": "ಸ್ಥಾವರ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳು",
        "dep_electrification": "ವಿದ್ಯುದೀಕರಣ ಮತ್ತು ಯುಟಿಲಿಟಿ",
        "dep_furniture": "ಪೀಠೋಪಕರಣ ಮತ್ತು ಕಚೇರಿ ಸಲಕರಣೆಗಳು",
        "dep_total": "ಒಟ್ಟು ವಾರ್ಷಿಕ ಸವಕಳಿ ಭತ್ಯೆ",
        # Amortization
        "amort_text": "ಅವಧಿ ಸಾಲ ಮರುಪಾವತಿಯನ್ನು 6 ತಿಂಗಳ ಮೊರಟೋರಿಯಂ ಅವಧಿಯೊಂದಿಗೆ ವಾರ್ಷಿಕ 10.0% ಬಡ್ಡಿದರದಲ್ಲಿ 5 ವರ್ಷಗಳ ಅವಧಿಗೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.",
        # Land & Site
        "land_desc": "ಉತ್ಪಾದನಾ ಘಟಕವು ಉತ್ತಮ ಹೆದ್ದಾರಿ ಸಂಪರ್ಕ ಮತ್ತು ಭಾರಿ ವಾಹನಗಳ ಸಂಚಾರಕ್ಕೆ ಸೂಕ್ತವಾದ ಕೈಗಾರಿಕಾ ವಲಯದಲ್ಲಿದೆ.",
        # Soft Intervention
        "soft_desc": "ಸೂಕ್ಷ್ಮ ಉದ್ಯಮಗಳನ್ನು ಸುಸ್ಥಿರ ಕೈಗಾರಿಕಾ ಘಟಕಗಳಾಗಿ ಪರಿವರ್ತಿಸಲು ಸಾಮರ್ಥ್ಯ ವೃದ್ಧಿ ಪ್ರಮುಖ ಪಾತ್ರ ವಹಿಸುತ್ತದೆ. VKF ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ, CEDOK ಮತ್ತು ರುಡ್‌ಸೆಟಿ (RUDSETI) ಸಂಸ್ಥೆಗಳ ಸಹಯೋಗದೊಂದಿಗೆ ವೃತ್ತಿಪರ ತರಬೇತಿ ನೀಡಲಾಗುತ್ತದೆ.",
        # Statutory
        "stat_gst": "ಜಿಎಸ್‌ಟಿ ನೋಂದಣಿ (GST)",
        "stat_udyam": "ಉದ್ಯಮ್ ಎಂಎಸ್‌ಎಂಇ ನೋಂದಣಿ",
        "stat_pcb": "ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣ ಮಂಡಳಿ ಅನುಮತಿ (CTE/CTO)",
        "stat_trade": "ಟ್ರೇಡ್ ಲೈಸೆನ್ಸ್ / ಕಾರ್ಖಾನೆ ಪರವಾನಗಿ",
        "stat_tax_dept": "ವಾಣಿಜ್ಯ ತೆರಿಗೆ ಇಲಾಖೆ",
        "stat_msme_min": "ಎಂಎಸ್‌ಎಂಇ ಸಚಿವಾಲಯ",
        "stat_pcb_board": "ರಾಜ್ಯ ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣ ಮಂಡಳಿ",
        "stat_munc": "ಸ್ಥಳೀಯ ನಗರಸಭೆ / ಪಂಚಾಯತ್",
        "stat_registered": "ನೋಂದಾಯಿಸಲಾಗಿದೆ",
        "stat_applied": "ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ / ಮಂಜೂರಾಗಿದೆ",
        "stat_active": "ಸಕ್ರಿಯ / ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
        # Schedules
        "sch_total_capex": "ಒಟ್ಟು ಯೋಜನಾ ಬಂಡವಾಳ ಹೂಡಿಕೆ",
        "sch_total_means": "ಒಟ್ಟು ಹಣಕಾಸಿನ ಮೂಲಗಳು",
        "sch_total_machinery": "ಒಟ್ಟು ಯಂತ್ರೋಪಕರಣ ಹೂಡಿಕೆ",
        "sch_reserves_surplus": "ಮೀಸಲು ಮತ್ತು ಉಳಿಕೆ ಲಾಭ (Accumulated PAT)",
        "sch_term_loan_out": "ಬಾಕಿ ಉಳಿದಿರುವ ಅವಧಿ ಸಾಲ",
        "lbl_image_product": "ಉತ್ಪನ್ನ ವಿವರಣೆ ಚಿತ್ರ",
        "lbl_image_facility": "ಸ್ಥಾವರ ಯಂತ್ರೋಪಕರಣಗಳ ವಿನ್ಯಾಸ",
        "lbl_image_team": "ಗುಣಮಟ್ಟ ಖಾತರಿ ಮತ್ತು ಸಿಬ್ಬಂದಿ ವಿವರ",
    },
    "hi": {
        "dpr_cover_title": "विस्तृत परियोजना रिपोर्ट (DPR)",
        "manufacturing_unit": "विनिर्माण इकाई",
        "by_vkf": "विजन कर्नाटक फाउंडेशन द्वारा",
        "lbl_enterprise_name": "उद्यम का नाम:",
        "lbl_service_type": "डीपीआर सेवा प्रकार:",
        "lbl_quality_tier": "योजना गुणवत्ता स्तर:",
        "lbl_financial_horizon": "वित्तीय योजना अवधि:",
        "lbl_legal_constitution": "कानूनी प्रकार:",
        "lbl_district_state": "जिला एवं राज्य:",
        "lbl_total_cost": "कुल परियोजना लागत:",
        "lbl_bank_loan": "आवश्यक बैंक ऋण:",
        "lbl_promoter_equity": "प्रवर्तक इक्विटी:",
        "toc_title": "विषय सूची",
        "th_sl_no": "क्र.सं",
        "th_content_section": "विषय अनुभाग",
        "th_page_no": "पृष्ठ संख्या",
        "toc_sec1": "जेएलजी / उद्यम सदस्यों का विवरण",
        "toc_sec2": "एसवीएसवाई एवं युवा शक्ति के उद्देश्य",
        "toc_sec3": "विजन कर्नाटक फाउंडेशन (VKF) के बारे में",
        "toc_sec4": "उत्पाद का नाम एवं प्रौद्योगिकी",
        "toc_sec5": "उत्पाद की आपूर्ति एवं बाजार",
        "toc_sec6": "प्रत्येक सदस्य की भूमिका एवं कर्मचारी पदानुक्रम",
        "toc_sec7": "क्षमता निर्माण एवं प्रशिक्षण",
        "toc_sec8": "अनुमानित परियोजना लागत एवं कार्यान्वयन समय सारणी",
        "toc_sec9": "भूमि / शेड अवसंरचना की स्थिति",
        "toc_sec10": "स्वाट (SWOT) विश्लेषण",
        "toc_sec11": "युवा सशक्तिकरण एवं पारिस्थितिकी तंत्र पर प्रभाव",
        "toc_sec12": "अंतिम उत्पाद (चित्र गैलरी)",
        "toc_sec13": "वित्तीय अनुमान एवं ऋण अदायगी अनुसूची",
        "sec1_title": "1. जेएलजी / उद्यम सदस्यों का अवलोकन",
        "sec1_sub": "पदानुक्रम सहित सदस्यों का विवरण:",
        "sec1_lbl_name": "उद्यम का नाम / जेएलजी:",
        "sec1_lbl_group": "समूह / प्रवर्तक का नाम:",
        "sec1_lbl_gp": "ग्राम पंचायत / तालुक:",
        "sec1_lbl_dist": "जिला एवं राज्य:",
        "sec1_lbl_bank": "खाता एवं बैंक विवरण:",
        "sec1_lbl_udyam": "उद्यम / जीएसटी / सिबिल:",
        "sec2_title": "2. एसवीएसवाई के उद्देश्य एवं कॉर्पोरेट प्रोफ़ाइल",
        "sec3_title": "3. मैक्रोइकॉनॉमिक वातावरण एवं परियोजना पृष्ठभूमि",
        "sec4_title": "4. उत्पाद का नाम और प्रौद्योगिकी",
        "sec5_title": "5. उत्पाद की आपूर्ति एवं बाजार विश्लेषण",
        "sec5_sub_assump": "विस्तृत परियोजना धारणाएं तालिका:",
        "sec5_sub_mach": "संयंत्र एवं मशीनरी उपकरण विवरण:",
        "sec6_title": "6. सदस्यों की भूमिका, कर्मचारी पदानुक्रम एवं तकनीकी साध्यता",
        "sec7_title": "7. क्षमता निर्माण एवं जोखिम विश्लेषण",
        "sec8_title": "8. अनुमानित परियोजना लागत एवं कार्यान्वयन समय सारणी",
        "sec8_sub_charts": "पूंजीगत व्यय एवं वित्तपोषण साधन चार्ट",
        "sec9_title": "9. भूमि एवं अवसंरचना स्थिति",
        "sec10_title": "10. स्वाट (SWOT) विश्लेषण एवं रणनीतिक रोडमैप",
        "sec11_title": "11. युवा सशक्तिकरण एवं पारिस्थितिकी प्रभाव",
        "sec12_title": "12. निर्मित अंतिम उत्पाद एवं गुणवत्ता आश्वासन",
        "sec13_title": "13. वित्तीय आंकड़े एवं अनुमान",
        "sec13_sub_cashflow": "5-वर्षीय नकदी प्रवाह विवरण (₹)",
        "sec13_sub_dscr": "अनुमानित सावधि ऋण DSCR विवरण",
        "sec13_sub_charts": "वित्तीय अनुमान एवं DSCR अनुपात चार्ट",
        "sec13_sub_val": "उन्नत कॉर्पोरेट वित्तीय मूल्यांकन (DCF एवं IRR)",
        "sec13_sub_sens": "संवेदनशीलता विश्लेषण मैट्रिक्स",
        "sec13_sub_esg": "ईएसजी (पर्यावरण, सामाजिक एवं शासन) स्कोरकार्ड",
        "sec14_title": "14. कार्यशील पूंजी आकलन अनुसूची (टंडन समिति मानदंड)",
        "sec15_title": "15. मूल्यह्रास अनुसूची (आयकर अधिनियम 1961)",
        "sec16_title": "16. सावधि ऋण अदायगी एवं प्रौद्योगिकी तत्परता",
        "sec17_title": "17. 10-वर्षीय विस्तृत लाभ एवं हानि विवरण (P&L)",
        "sec18_title": "18. 36-माह विस्तृत मासिक नकदी प्रवाह विवरण",
        "sec19_title": "19. कच्चे माल का बीओक्यू (BOQ) एवं खरीद मैट्रिक्स",
        "sec20_title": "20. मानव संसाधन वेतन एवं पदनाम मैट्रिक्स",
        "sec21_title": "21. टंडन एवं नायक समिति कार्यशील पूंजी मानदंड",
        "sec22_title": "22. प्रौद्योगिकी व्यावसायीकरण एवं तत्परता ऑडिट",
        "sec23_title": "23. ईएसजी एवं पर्यावरणीय स्थिरता स्कोरकार्ड",
        "sec24_title": "24. बहु-परिदृश्य संवेदनशीलता एवं स्ट्रेस-टेस्ट विश्लेषण",
        "sec25_title": "25. स्वाट (SWOT) विश्लेषण एवं प्रतिस्पर्धी तुलना",
        "sec26_title": "26. लागू केंद्रीय एवं राज्य सब्सिडी योजनाएं",
        "sec27_title": "27. स्थल अवसंरचना, विद्युत ग्रिड एवं उपयोगिताएं",
        "sec28_title": "28. विपणन, ब्रांडिंग एवं वितरण रणनीति",
        "sec29_title": "29. वैधानिक अनुपालन, लाइसेंस एवं अनुमोदन चेकलिस्ट",
        "sec30_title": "30. बैंक ऋण अनुशंसा एवं निष्कर्ष",
        "sec31_title": "31. घोषणा एवं अधिकृत हस्ताक्षर",
        "decl_text": "मैं/हम एतद्द्वारा प्रमाणित करते हैं कि इस विस्तृत परियोजना रिपोर्ट (DPR) में प्रस्तुत सभी जानकारी एवं वित्तीय अनुमान मेरी/हमारी सर्वोत्तम जानकारी और विश्वास के अनुसार सत्य एवं सही हैं। बैंक ऋण स्वीकृति हेतु सभी वित्तीय अनुमान यथार्थवादी परिचालन मानकों के आधार पर तैयार किए गए हैं।",
        "decl_doc_ref": "दस्तावेज़ संदर्भ:",
        "decl_guidance": "मार्गदर्शन में तैयार:",
        "decl_guidance_val": "विजन कर्नाटक फाउंडेशन (VKF) डीपीआर मार्गदर्शन ढांचा",
        "decl_verif": "सत्यापन स्थिति:",
        "decl_verif_val": "संस्थागत मूल्यांकन एवं ऋण स्वीकार्यता सत्यापित",
        "decl_place": "स्थान:",
        "decl_date": "दिनांक:",
        "decl_for": "के लिए",
        "decl_signatory": "अधिकृत हस्ताक्षरकर्ता",
        "decl_end_note": "*** विस्तृत परियोजना रिपोर्ट समाप्त — विजन कर्नाटक फाउंडेशन ***",
        "sched_sub_heading": "वित्तीय अनुबंध एवं विस्तृत अनुसूची कार्यपत्रक",
        "sched_sub_desc": "परियोजना मूल्यांकन, क्रेडिट रेटिंग और ऋण स्वीकृति के समर्थन हेतु 10 बैंकेबल वित्तीय अनुसूचियां नीचे दी गई हैं।",
        "sched1_title": "अनुबंध अनुसूची 1: विस्तृत परियोजना लागत एवं पूंजीगत व्यय",
        "sched2_title": "अनुबंध अनुसूची 2: वित्तपोषण के साधन एवं प्रवर्तक मार्जिन",
        "sched3_title": "अनुबंध अनुसूची 3: संयंत्र एवं मशीनरी खरीद विवरण",
        "sched4_title": "अनुबंध अनुसूची 4: संगठनात्मक जनशक्ति वेतन विवरण",
        "sched5_title": "अनुबंध अनुसूची 5: कच्चे माल का बीओक्यू (BOQ) विवरण",
        "sched6_title": "अनुबंध अनुसूची 6: 10-वर्षीय अनुमानित लाभप्रदता विवरण",
        "sched7_title": "अनुबंध अनुसूची 7: 10-वर्षीय अनुमानित तुलन पत्र (बैलेंस शीट)",
        "sched8_title": "अनुबंध अनुसूची 8: 36-माह मासिक नकदी प्रवाह कार्यपत्रक",
        "sched9_title": "अनुबंध अनुसूची 9: ऋण सेवा कवरेज अनुपात (DSCR) कार्यपत्रक",
        "sched10_title": "अनुबंध अनुसूची 10: आयकर अधिनियम मूल्यह्रास कार्यपत्रक",
        "th_particulars": "विवरण",
        "th_amount": "राशि (₹)",
        "th_qty": "मात्रा",
        "th_rate": "दर (₹)",
        "th_total": "कुल (₹)",
        "th_year": "वर्ष",
        "th_y1": "वर्ष 1",
        "th_y2": "वर्ष 2",
        "th_y3": "वर्ष 3",
        "th_y4": "वर्ष 4",
        "th_y5": "वर्ष 5",
        "th_member_name": "सदस्य का नाम",
        "th_designation": "पदनाम",
        "th_gender_age": "लिंग / आयु",
        "th_qualification": "योग्यता",
        "th_experience": "अनुभव",
        "th_machine_desc": "मशीन / उपकरण विवरण",
        "th_unit_price": "इकाई मूल्य (₹)",
        "th_total_cost": "कुल लागत (₹)",
        "th_expenditure_head": "परियोजना व्यय मद",
        "th_pct_total": "कुल का %",
        "th_total_project_cost": "कुल परियोजना लागत",
        "th_total_manpower": "कुल जनशक्ति",
        # General & Table Headers
        "th_parameter": "पैरामीटर",
        "th_model_value": "मॉडल मान",
        "th_role_category": "पद / श्रेणी",
        "th_personnel_count": "कार्मिक संख्या",
        "th_monthly_salary": "मासिक वेतन (₹)",
        "th_monthly_total": "मासिक कुल (₹)",
        "th_annual_total": "वार्षिक कुल (₹)",
        "th_holding_period": "धारण अवधि",
        "th_asset_block": "परिसंपत्ति वर्ग",
        "th_depr_rate": "मूल्यह्रास दर (%)",
        "th_fin_year": "वित्तीय वर्ष",
        "th_opening_balance": "प्रारंभिक शेष (₹)",
        "th_principal_repay": "मूलधन अदायगी (₹)",
        "th_interest_exp": "ब्याज व्यय (₹)",
        "th_closing_balance": "अंतिम शेष (₹)",
        "th_mth": "माह",
        "th_yr": "वर्ष",
        "th_revenue": "राजस्व (₹)",
        "th_operating_costs": "परिचालन व्यय (₹)",
        "th_pbdit": "PBDIT (₹)",
        "th_interest": "ब्याज (₹)",
        "th_depr": "मूल्यह्रास (₹)",
        "th_pat": "शुद्ध लाभ PAT (₹)",
        "th_dscr": "डीएससीआर अनुपात",
        "th_principal": "मूलधन (₹)",
        "th_closing_loan": "बकाया ऋण (₹)",
        "th_net_cash": "शुद्ध नकदी (₹)",
        "th_raw_item": "कच्चा माल / घटक",
        "th_unit": "मात्रा इकाई",
        "th_annual_qty": "वार्षिक आवश्यक मात्रा",
        "th_unit_rate": "इकाई दर (₹)",
        "th_staff_category": "कर्मचारी श्रेणी",
        "th_no_personnel": "कर्मचारियों की संख्या",
        "th_monthly_salary_person": "मासिक वेतन / व्यक्ति (₹)",
        "th_component": "घटक",
        "th_funding_source": "वित्तपोषण का स्रोत",
        "th_pct_share": "% हिस्सा",
        "th_estimated_outlay": "अनुमानित परिव्यय (₹)",
        "th_liabilities_assets": "देनदारियां / संपत्तियां",
        "th_debt_service": "ऋण सेवा दायित्व (₹)",
        "th_pillar": "स्तंभ",
        "th_details": "विवरण",
        "th_stat_reg": "वैधानिक पंजीकरण / अनुमोदन",
        "th_issuing_authority": "जारीकर्ता प्राधिकरण",
        "th_compliance_status": "अनुपालन स्थिति",
        "th_stress_scenario": "स्ट्रेस टेस्ट परिदृश्य",
        "th_proj_dscr": "अनुमानित DSCR",
        "th_npv_impact": "NPV प्रभाव (₹)",
        "th_viability_status": "परियोजना स्वीकार्यता",
        "th_esg_dimension": "ईएसजी एवं टीसीआरएम आयाम",
        "th_eval_rating": "मूल्यांकन रेटिंग",
        "th_key_measures": "प्रमुख स्थिरता उपाय",
        "th_wc_param": "कार्यशील पूंजी पैरामीटर",
        "th_method1": "विधि I (75% NWC अंतर)",
        "th_method2": "विधि II (75% चालू संपत्ति)",
        "th_corp_param": "कॉर्पोरेट वित्तीय पैरामीटर",
        "th_calc_val": "परिकलित मान",
        "th_benchmark": "मानक बेंचमार्क",
        # Capex items
        "capex_land": "भूमि एवं स्थल विकास",
        "capex_building": "सिविल कार्य एवं भवन शेड",
        "capex_machinery": "संयंत्र, मशीनरी एवं उपकरण",
        "capex_electrification": "विद्युतीकरण एवं उपयोगिता व्यवस्था",
        "capex_furniture": "फर्नीचर, कार्यालय एवं फिक्स्चर",
        "capex_working_capital": "कार्यशील पूंजी मार्जिन मनी",
        "capex_preoperative": "पूर्व-परिचालन व्यय एवं आकस्मिकता",
        "fin_promoter_equity": "प्रवर्तक इक्विटी पूंजी",
        "fin_term_loan": "बैंक सावधि ऋण",
        "fin_subsidy": "सरकारी पूंजीगत सब्सिडी",
        "fin_total": "वित्तपोषण के कुल साधन",
        # Manpower items
        "mp_management": "प्रबंधन एवं तकनीकी नेतृत्व",
        "mp_supervisors": "पर्यवेक्षी कर्मचारी एवं इंजीनियर",
        "mp_skilled": "कुशल ऑपरेटर एवं तकनीशियन",
        "mp_unskilled": "अर्ध-कुशल / सहायक कर्मचारी",
        "mp_admin": "प्रशासन, लेखा एवं विपणन कर्मचारी",
        "lbl_total_manpower_req": "कुल आवश्यक जनशक्ति संख्या:",
        "lbl_monthly_wages_budget": "मासिक वेतन बजट:",
        "lbl_persons": "व्यक्ति",
        # Assumptions
        "assump_capacity_day": "दैनिक स्थापित क्षमता",
        "assump_working_days": "प्रति वर्ष कार्य दिवस",
        "assump_working_hours": "दैनिक कार्य घंटे",
        "assump_capacity_util": "क्षमता उपयोग प्रोफ़ाइल",
        "assump_raw_cost": "प्रति इकाई औसत कच्चा माल लागत",
        "assump_sale_price": "प्रति इकाई औसत विक्रय मूल्य",
        "assump_supplier": "आपूर्तिकर्ता विवरण:",
        "assump_location": "स्थान:",
        "assump_plant_mach_cost": "संयंत्र एवं मशीनरी लागत:",
        "assump_plant_mach_inc": "(स्वचालित मशीनरी एवं उपकरण शामिल हैं)।",
        # SWOT
        "swot_strengths": "शक्तियां (Strengths)",
        "swot_weaknesses": "कमजोरियां (Weaknesses)",
        "swot_opportunities": "अवसर (Opportunities)",
        "swot_threats": "चुनौतियां (Threats)",
        "swot_strengths_default": "अत्याधुनिक स्वचालित मशीनरी, अनुभवी प्रवर्तक, क्षेत्रीय बाजार में उच्च मांग।",
        "swot_weaknesses_default": "प्रारंभिक चरण में पूंजी निवेश और वितरण नेटवर्क के विस्तार की आवश्यकता।",
        "swot_opportunities_default": "बढ़ती औद्योगिक मांग, सरकारी PMEGP/PMFME सब्सिडी प्रोत्साहन, उत्पाद विविधीकरण।",
        "swot_threats_default": "कच्चे माल के बाजार मूल्य में उतार-चढ़ाव और स्थानीय प्रतिस्पर्धा।",
        "soft_desc": "सूक्ष्म उद्यमों को व्यावसायिक रूप से व्यवहार्य औद्योगिक इकाइयों में बदलने के लिए क्षमता निर्माण महत्वपूर्ण भूमिका निभाता है। वीकेएफ ढांचे के तहत, सेडॉक (CEDOK) और आरयूडीएसईटीआई (RUDSETI) जैसे क्षेत्रीय संस्थानों के सहयोग से संरचित कौशल उन्नयन एवं प्रबंधन प्रशिक्षण प्रदान किया जाता है।",
        # Schedules
        "sch_total_capex": "कुल परियोजना पूंजीगत व्यय",
        "sch_total_means": "वित्तपोषण के कुल साधन",
        "sch_total_machinery": "कुल मशीनरी निवेश",
        "sch_reserves_surplus": "आरक्षित निधि एवं अधिशेष (संचित PAT)",
        "sch_term_loan_out": "बकाया सावधि ऋण",
        "lbl_image_product": "उत्पाद विवरण चित्र",
        "lbl_image_facility": "संयंत्र एवं मशीनरी लेआउट",
        "lbl_image_team": "गुणवत्ता आश्वासन एवं कार्यबल विवरण",
    }
}

class DPRTemplateCompositionEngine:

    @staticmethod
    def _file_to_base64_uri(file_path: str, mime_type: str) -> str:
        if os.path.exists(file_path):
            try:
                with open(file_path, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    return f"data:{mime_type};base64,{encoded_string}"
            except Exception:
                pass
        return ""

    @classmethod
    def compose_html_document(cls, doc: DPRDocumentModel, templates_dir: str) -> str:
        # Resolve structure, narratives, and diagrams
        structure_info = DPRStructureEngine.resolve_structure(doc)
        narratives = (doc.narratives if (doc.narratives and len(doc.narratives) > 0) else None) or DPRContentEngine.generate_narratives(doc)
        diagrams = DeterministicDiagramEngine.generate_html_diagrams(doc)

        upload_dir = os.path.join(os.path.dirname(templates_dir), "uploads")
        resolved_images = ImageManagementEngine.resolve_image_paths(doc, upload_dir)

        def resolve_to_b64(path_val):
            if not path_val:
                return None
            p_str = str(path_val).strip()
            if not p_str:
                return None
            if p_str.startswith("data:image"):
                return p_str

            clean_name = os.path.basename(p_str.split("?")[0])
            abs_u = os.path.join(upload_dir, clean_name)
            if os.path.exists(abs_u) and os.path.isfile(abs_u):
                ext = os.path.splitext(abs_u)[1].lower().replace(".", "")
                mime = "jpeg" if ext in ["jpg", "jpeg"] else "png"
                return cls._file_to_base64_uri(abs_u, f"image/{mime}")

            if os.path.exists(p_str) and os.path.isfile(p_str):
                ext = os.path.splitext(p_str)[1].lower().replace(".", "")
                mime = "jpeg" if ext in ["jpg", "jpeg"] else "png"
                return cls._file_to_base64_uri(p_str, f"image/{mime}")

            if p_str.startswith("http://") or p_str.startswith("https://"):
                try:
                    import urllib.request
                    req = urllib.request.Request(p_str, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=5) as resp:
                        ctype = resp.headers.get('Content-Type', 'image/png')
                        b64 = base64.b64encode(resp.read()).decode("utf-8")
                        return f"data:{ctype};base64,{b64}"
                except Exception as e:
                    print(f"Error downloading remote logo {p_str}: {e}")
                    return p_str

            return None

        # Resolve logo: prioritize user uploaded logo
        user_logo_b64 = resolve_to_b64(resolved_images.get("logo") or doc.logo_path) or ""

        assets_dir = os.path.join(templates_dir, "assets")
        banner_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "vkf_header_banner.png"), "image/png")
        default_logo_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "vkf_official_logo.png"), "image/png")

        associated_with_vkf = getattr(doc, 'associated_with_vkf', False)

        prod1_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "product_sample_1.jpg"), "image/jpeg")
        prod2_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "product_sample_2.jpg"), "image/jpeg")
        prod3_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "product_sample_3.jpg"), "image/jpeg")

        # Convert generated chart files to Base64 URIs
        charts_b64: Dict[str, str] = {}
        if doc.chart_paths:
            for c_name, c_path in doc.chart_paths.items():
                if c_path and os.path.exists(c_path):
                    charts_b64[c_name] = cls._file_to_base64_uri(c_path, "image/png")

        user_product_b64 = resolve_to_b64(resolved_images.get("product") or doc.product_path)
        user_facility_b64 = resolve_to_b64(resolved_images.get("facility") or doc.facility_path)
        user_team_b64 = resolve_to_b64(resolved_images.get("team") or doc.team_path)

        product_card_b64 = user_product_b64 or resolve_to_b64(resolved_images.get("product"))
        facility_card_b64 = user_facility_b64 or resolve_to_b64(resolved_images.get("facility"))
        quality_card_b64 = user_team_b64 or resolve_to_b64(resolved_images.get("team"))

        env = Environment(loader=FileSystemLoader(templates_dir))
        env.filters['inr'] = format_inr
        env.filters['indian_num'] = format_inr
        env.filters['indian_words'] = format_indian_words
        template = env.get_template("dpr_template.html")

        # Determine language
        raw_lang = str(getattr(doc, 'language', 'en') or 'en').lower()
        lang_code = 'kn' if 'kn' in raw_lang else ('hi' if 'hi' in raw_lang else 'en')
        report_i18n = REPORT_I18N.get(lang_code, REPORT_I18N["en"])

        depth_str = getattr(doc.dpr_depth, 'value', str(doc.dpr_depth)).lower()
        if 'entry' in depth_str or 'basic' in depth_str or 'sum' in depth_str:
            if lang_code == 'kn':
                plan_quality_tier = "ಮೂಲ / ಕಾರ್ಯಕಾರಿ ಸಾರಾಂಶ DPR"
                target_page_range = "12 - 18 ಪುಟಗಳು"
                financial_horizon = "5-ವರ್ಷಗಳ ಮೂಲ ಹಣಕಾಸು ಮಾದರಿ"
            elif lang_code == 'hi':
                plan_quality_tier = "आवश्यक / कार्यकारी सारांश डीपीआर"
                target_page_range = "12 - 18 पृष्ठ"
                financial_horizon = "5-वर्षीय बुनियादी वित्तीय मॉडल"
            else:
                plan_quality_tier = "Essential / Executive Summary DPR"
                target_page_range = "12 - 18 Pages"
                financial_horizon = "5-Year Essential Model"
            tier_code = "ENTRY"
        elif 'core' in depth_str or 'standard' in depth_str:
            if lang_code == 'kn':
                plan_quality_tier = "ಪ್ರಮಾಣಿತ ಬ್ಯಾಂಕ್ ಮಾನ್ಯತೆಯ DPR"
                target_page_range = "22 - 32 ಪುಟಗಳು"
                financial_horizon = "5-ವರ್ಷಗಳ ವಿವರವಾದ ಮಾದರಿ"
            elif lang_code == 'hi':
                plan_quality_tier = "मानक बैंकेबल डीपीआर"
                target_page_range = "22 - 32 पृष्ठ"
                financial_horizon = "5-वर्षीय विस्तृत वित्तीय मॉडल"
            else:
                plan_quality_tier = "Standard Bankable DPR"
                target_page_range = "22 - 32 Pages"
                financial_horizon = "5-Year Detailed Model"
            tier_code = "CORE"
        elif 'team' in depth_str or 'adv' in depth_str:
            if lang_code == 'kn':
                plan_quality_tier = "ಸುಧಾರಿತ ಸಾಂಸ್ಥಿಕ ಹಾಗೂ ಸಿಂಡಿಕೇಶನ್ DPR"
                target_page_range = "38 - 52 ಪುಟಗಳು"
                financial_horizon = "7-ವರ್ಷಗಳ ವಿಸ್ತೃತ ಮಾದರಿ"
            elif lang_code == 'hi':
                plan_quality_tier = "उन्नत संस्थागत एवं सिंडिकेशन डीपीआर"
                target_page_range = "38 - 52 पृष्ठ"
                financial_horizon = "7-वर्षीय विस्तारित मॉडल"
            else:
                plan_quality_tier = "Advanced Institutional & Syndication DPR"
                target_page_range = "38 - 52 Pages"
                financial_horizon = "7-Year Extended Model"
            tier_code = "TEAM"
        else:
            if lang_code == 'kn':
                plan_quality_tier = "ಅಲ್ಟ್ರಾ-ಪ್ರೀಮಿಯಂ ಸಾಂಸ್ಥಿಕ ಹಾಗೂ ಹೂಡಿಕೆದಾರರ ಪಿಚ್ DPR"
                target_page_range = "55 - 75+ ಪುಟಗಳು"
                financial_horizon = "10-ವರ್ಷಗಳ ಸಾಂಸ್ಥಿಕ ಮಾದರಿ + BOQ + ESG"
            elif lang_code == 'hi':
                plan_quality_tier = "अल्ट्रा-प्रीमियम संस्थागत एवं निवेशक पिच डीपीआर"
                target_page_range = "55 - 75+ पृष्ठ"
                financial_horizon = "10-वर्षीय संस्थागत मॉडल + BOQ + ESG"
            else:
                plan_quality_tier = "Ultra-Premium Institutional Bankable & Investor Pitch DPR"
                target_page_range = "55 - 75+ Pages"
                financial_horizon = "10-Year Institutional Model + BOQ + ESG"
            tier_code = "ENTERPRISE"

        context = doc.model_dump()
        raw_dpr_type = doc.dpr_type.value if hasattr(doc.dpr_type, "value") else str(doc.dpr_type)
        raw_entity_type = str(doc.entity_type or "Proprietorship")

        if lang_code == 'kn':
            if 'gov' in raw_dpr_type.lower() or 'subsidy' in raw_dpr_type.lower():
                dpr_type_label = "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಮತ್ತು ಅನುದಾನ DPR (PMEGP/PMFME)"
            elif 'invest' in raw_dpr_type.lower() or 'pitch' in raw_dpr_type.lower():
                dpr_type_label = "ಹೂಡಿಕೆದಾರರ ಬಿಸಿನೆಸ್ ಪಿಚ್ DPR"
            elif 'corp' in raw_dpr_type.lower():
                dpr_type_label = "ಸಾಂಸ್ಥಿಕ ಕಾರ್ಪೊರೇಟ್ DPR"
            else:
                dpr_type_label = "ಬ್ಯಾಂಕ್ ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ DPR"

            if 'proprietor' in raw_entity_type.lower():
                entity_label = "ಏಕಮಾಲೀಕತ್ವ ಸಂಸ್ಥೆ (Proprietorship)"
            elif 'partner' in raw_entity_type.lower():
                entity_label = "ಪಾಲುದಾರಿಕೆ ಸಂಸ್ಥೆ (Partnership)"
            elif 'pvt' in raw_entity_type.lower() or 'private' in raw_entity_type.lower():
                entity_label = "ಖಾಸಗಿ ನಿಯಮಿತ ಕಂಪನಿ (Private Limited)"
            elif 'llp' in raw_entity_type.lower():
                entity_label = "ಸೀಮಿತ ಹೊಣೆಗಾರಿಕೆ ಪಾಲುದಾರಿಕೆ (LLP)"
            else:
                entity_label = raw_entity_type
        elif lang_code == 'hi':
            if 'gov' in raw_dpr_type.lower() or 'subsidy' in raw_dpr_type.lower():
                dpr_type_label = "सरकारी सब्सिडी एवं अनुदान डीपीआर (PMEGP/PMFME)"
            elif 'invest' in raw_dpr_type.lower() or 'pitch' in raw_dpr_type.lower():
                dpr_type_label = "निवेशक एवं बिजनेस पिच डीपीआर"
            elif 'corp' in raw_dpr_type.lower():
                dpr_type_label = "कॉर्पोरेट उद्यम डीपीआर"
            else:
                dpr_type_label = "बैंक ऋण एवं सब्सिडी डीपीआर"

            if 'proprietor' in raw_entity_type.lower():
                entity_label = "एकल स्वामित्व फर्म (Proprietorship)"
            elif 'partner' in raw_entity_type.lower():
                entity_label = "साझेदारी फर्म (Partnership)"
            elif 'pvt' in raw_entity_type.lower() or 'private' in raw_entity_type.lower():
                entity_label = "प्राइवेट लिमिटेड कंपनी (Private Limited)"
            elif 'llp' in raw_entity_type.lower():
                entity_label = "सीमित दायित्व भागीदारी (LLP)"
            else:
                entity_label = raw_entity_type
        else:
            dpr_type_label = raw_dpr_type
            entity_label = raw_entity_type

        context["dpr_type"] = dpr_type_label
        context["entity_type"] = entity_label
        context["report_i18n"] = report_i18n
        context["report_lang"] = lang_code
        context["plan_quality_tier"] = plan_quality_tier
        context["target_page_range"] = target_page_range
        context["financial_horizon"] = financial_horizon
        context["plan_tier_code"] = tier_code
        context["structure"] = structure_info
        context["narratives"] = narratives
        context["diagrams"] = diagrams
        context["charts_b64"] = charts_b64
        context["associated_with_vkf"] = associated_with_vkf
        context["vkf_header_banner_b64"] = banner_b64
        context["vkf_official_logo_b64"] = default_logo_b64 if associated_with_vkf else ""
        context["user_logo_b64"] = user_logo_b64
        context["org_logo_b64"] = user_logo_b64 or (default_logo_b64 if associated_with_vkf else "")
        context["user_product_b64"] = user_product_b64
        context["user_facility_b64"] = user_facility_b64
        context["user_team_b64"] = user_team_b64
        context["product_card_b64"] = product_card_b64
        context["facility_card_b64"] = facility_card_b64
        context["quality_card_b64"] = quality_card_b64
        context["product_sample_1_b64"] = prod1_b64
        context["product_sample_2_b64"] = prod2_b64
        context["product_sample_3_b64"] = prod3_b64
        context["machinery_total"] = sum(m.total for m in doc.machinery) if doc.machinery else (doc.total_cost * 0.40)

        # Generate High-Impact Vector SVG Charts
        projections_list = [p.model_dump() if hasattr(p, 'model_dump') else p for p in doc.projections] if doc.projections else []
        context["chart_financial_trend_svg"] = ChartRenderer.render_financial_trend_chart(projections_list, lang=lang_code)
        context["chart_means_of_finance_svg"] = ChartRenderer.render_means_of_finance_chart(doc.total_cost, doc.bank_loan, doc.promoter_contribution, getattr(doc, 'subsidy', 0), lang=lang_code)
        context["chart_dscr_trend_svg"] = ChartRenderer.render_dscr_trend_chart(projections_list, lang=lang_code)

        if not context.get("hr_summary"):
            m_cost = (doc.mgmt_count * doc.mgmt_salary) + (doc.sup_count * doc.sup_salary) + (doc.skill_count * doc.skill_salary) + (doc.unskill_count * doc.unskill_salary) + (doc.admin_count * doc.admin_salary)
            context["hr_summary"] = {
                "total_staff": doc.mgmt_count + doc.sup_count + doc.skill_count + doc.unskill_count + doc.admin_count,
                "monthly_salary_cost": m_cost,
                "annual_salary_cost": m_cost * 12.0,
                "mgmt_cost": doc.mgmt_count * doc.mgmt_salary,
                "sup_cost": doc.sup_count * doc.sup_salary,
                "skill_cost": doc.skill_count * doc.skill_salary,
                "unskill_cost": doc.unskill_count * doc.unskill_salary,
                "admin_cost": doc.admin_count * doc.admin_salary
            }

        return template.render(data=context, **context)
