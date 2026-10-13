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

def format_inr(val):
    if val is None or val == "":
        return "0"
    try:
        val = float(val)
    except (ValueError, TypeError):
        return str(val)
    
    is_int = (val % 1 == 0)
    s = f"{val:.2f}" if not is_int else f"{int(val)}"
    parts = s.split('.')
    integer_part = parts[0]
    
    negative = integer_part.startswith('-')
    if negative:
        integer_part = integer_part[1:]
    
    if len(integer_part) > 3:
        last3 = integer_part[-3:]
        rest = integer_part[:-3]
        groups = []
        while len(rest) > 2:
            groups.insert(0, rest[-2:])
            rest = rest[:-2]
        if rest:
            groups.insert(0, rest)
        formatted = ",".join(groups) + "," + last3
    else:
        formatted = integer_part
        
    if negative:
        formatted = "-" + formatted
        
    if not is_int and len(parts) > 1 and int(parts[1]) > 0:
        formatted += "." + parts[1]
        
    return formatted

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
        context["dpr_type"] = doc.dpr_type.value if hasattr(doc.dpr_type, "value") else str(doc.dpr_type)
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
        context["chart_financial_trend_svg"] = ChartRenderer.render_financial_trend_chart(projections_list)
        context["chart_means_of_finance_svg"] = ChartRenderer.render_means_of_finance_chart(doc.total_cost, doc.bank_loan, doc.promoter_contribution, getattr(doc, 'subsidy', 0))
        context["chart_dscr_trend_svg"] = ChartRenderer.render_dscr_trend_chart(projections_list)

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
