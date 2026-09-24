import os
import json
from typing import Dict, Any
from dpr_engine.data_model import DPRDocumentModel, IndustryCategoryEnum
from dpr_engine.content_library.industries.manufacturing import ManufacturingNarrative
from dpr_engine.content_library.industries.food_processing import FoodProcessingNarrative
from dpr_engine.content_library.industries.corporate_sectors import CorporateSectorsNarrative
from dpr_engine.agents.llm_provider import get_llm_provider, GeminiLLMProvider

class DPRContentEngine:

    @classmethod
    def generate_narratives(cls, doc: DPRDocumentModel) -> Dict[str, str]:
        ind = str(doc.industry).lower()

        if "solar" in ind or doc.industry == IndustryCategoryEnum.SOLAR_ENERGY:
            narratives = CorporateSectorsNarrative.get_solar_energy_sections(doc)
        elif "ev" in ind or "battery" in ind or doc.industry == IndustryCategoryEnum.EV_BATTERY:
            narratives = CorporateSectorsNarrative.get_ev_battery_sections(doc)
        elif "pharma" in ind or doc.industry == IndustryCategoryEnum.PHARMA:
            narratives = CorporateSectorsNarrative.get_pharma_sections(doc)
        elif "data" in ind or "cloud" in ind or doc.industry == IndustryCategoryEnum.DATA_CENTER:
            narratives = CorporateSectorsNarrative.get_data_center_sections(doc)
        elif doc.industry == IndustryCategoryEnum.FOOD_PROCESSING or "food" in ind:
            narratives = FoodProcessingNarrative.get_sections(doc)
        else:
            narratives = ManufacturingNarrative.get_sections(doc)

        # Support custom user-specified sector & activity descriptions when 'other' is selected
        custom_sector_str = getattr(doc, 'custom_sector', None)
        custom_activity_str = getattr(doc, 'custom_activity', None)

        if custom_sector_str or custom_activity_str:
            sec_display = custom_sector_str or "Custom Business Sector"
            act_display = custom_activity_str or "Custom Activity"
            narratives["sector_overview"] = (
                f"<p><strong>Sector Profile — {sec_display}:</strong><br>"
                f"The proposed venture operates within the <strong>{sec_display}</strong> sector, focusing on <strong>{act_display}</strong>. "
                f"This enterprise addresses specialized market demands through targeted operational workflows and dedicated technical capabilities.</p>"
            ) + narratives.get("sector_overview", "")

        # Merge rich website-extracted content into narrative sections
        if doc.business_desc and len(doc.business_desc.strip()) > 10:
            narratives["custom_business_desc"] = doc.business_desc
            if "product_description" in narratives:
                narratives["product_description"] += (
                    f"<p><strong>4.6 Web-Extracted Corporate Overview & Technical Profile:</strong><br>"
                    f"{doc.business_desc}</p>"
                )

        if doc.usp and len(doc.usp.strip()) > 5:
            if "product_description" in narratives:
                narratives["product_description"] += (
                    f"<p><strong>4.7 Key Value Proposition & Technical Capabilities:</strong><br>"
                    f"{doc.usp}</p>"
                )

        # Invoke Live Gemini AI Generation when API Key is active
        provider = get_llm_provider()
        if isinstance(provider, GeminiLLMProvider):
            try:
                ai_narratives = cls._generate_gemini_enhanced_narratives(doc, provider)
                for k, v in ai_narratives.items():
                    if v and len(str(v).strip()) > 30:
                        narratives[k] = v
            except Exception as e:
                print(f"[DPRContentEngine Notice] Gemini AI Narrative Generation fallback to template: {e}")

        # Ensure Key Aliases match template placeholders
        narratives["scheme_subsidy_narrative"] = narratives.get("scheme_subsidy_narrative") or narratives.get("subsidy_schemes_narrative", "")
        narratives["subsidy_schemes_narrative"] = narratives["scheme_subsidy_narrative"]

        narratives["land_shed_infrastructure"] = narratives.get("land_shed_infrastructure") or narratives.get("site_utilities_narrative", "")
        narratives["site_utilities_narrative"] = narratives["land_shed_infrastructure"]

        narratives["statutory_compliance_narrative"] = narratives.get("statutory_compliance_narrative") or narratives.get("statutory_compliances_narrative", "")
        narratives["statutory_compliances_narrative"] = narratives["statutory_compliance_narrative"]

        narratives["conclusion_narrative"] = narratives.get("conclusion_narrative") or narratives.get("conclusion", "")
        narratives["conclusion"] = narratives["conclusion_narrative"]

        return narratives

    @classmethod
    def _generate_gemini_enhanced_narratives(cls, doc: DPRDocumentModel, provider: GeminiLLMProvider) -> Dict[str, str]:
        m_list = getattr(doc, 'machinery', []) or []
        m_names = [getattr(m, 'name', str(m)) for m in m_list] if m_list else ["Automated Heavy Duty Precision Machinery"]
        
        raw_list = getattr(doc, 'raw_materials_list', None) or getattr(doc, 'boq_raw_materials', None) or []
        boq_items = [getattr(b, 'item', getattr(b, 'name', str(b))) for b in raw_list] if raw_list else ["High Grade Raw Materials"]

        system_instruction = (
            "You are an expert Senior Financial Analyst and Technical DPR Author for Indian Lead Banks (SBI, Canara, HDFC) and MSME Schemes (PMEGP, SVSY, CGTMSE).\n"
            "Generate authoritative, highly detailed, multi-paragraph bankable HTML narratives.\n"
            "Each narrative section MUST contain 7 to 8 comprehensive, highly detailed, long paragraphs using <p><strong>Subheading Title:</strong><br>Detailed text...</p> format.\n"
            "Include specific technical standards (ISO 9001:2015, HSN codes), financial coverage metrics, market CAGRs, and operational workflows tailored to the client business."
        )

        base_info = f"""
Client Project Details:
- Business Name: {doc.business_name}
- Promoter: {getattr(doc, 'promoter_name', 'Lead Promoter')}
- Product / Service: {doc.primary_product}
- Sector / Activity: {doc.industry} / {getattr(doc, 'activity', 'manufacturing')}
- Location: {doc.district}, {doc.state}
- Total Cost: ₹{doc.total_cost:,.2f}
- Bank Loan Requested: ₹{doc.bank_loan:,.2f}
- Promoter Equity: ₹{doc.promoter_contribution:,.2f}
- Subsidy Claim: ₹{getattr(doc, 'subsidy', 0):,.2f}
- Business Description: {doc.business_desc or 'High-precision manufacturing facility.'}
- Key Value Proposition / USP: {doc.usp or 'Sub-micron precision tolerance, automated cell loading.'}
- Key Machinery: {', '.join(m_names[:5])}
- Key Raw Materials: {', '.join(boq_items[:5])}
"""

        prompt_part1 = base_info + """
Return a JSON object with the following keys containing multi-paragraph detailed HTML text (7-8 detailed paragraphs per key):
1. "exec_summary": 7-8 detailed paragraphs covering Strategic Rationale, Executive Summary, Capital Outlay Rationale, Means of Finance & Debt Structuring, Financial Viability & Bank Sanction Rationale, Project Implementation Schedule, and Risk Summary.
2. "business_overview": 7-8 detailed paragraphs covering Corporate Constitution & Statutory Profile, Promoter Background & Management Competence, Vision & Mission, Corporate Office & Industrial Location, Ownership Structure, Key Personnel, and Past Financial Track Record.
3. "project_background": 7-8 detailed paragraphs covering Macroeconomic Environment & Industrial Context, Strategic Necessity of Project Setup, Alignment with National & State MSME Policies, Technology Selection Rationale, Regional Growth Drivers, Supply-Demand Gap Analysis, and Import Substitution Potential.
4. "product_description": 7-8 detailed paragraphs covering Primary Product Line & Technical Specifications, Manufacturing Workflow & Quality Inspection, Installed Daily Capacity & Utilization Profile, Value Proposition & Competitive Edge, Packaging & Storage Management, Product Life Cycle & Applications, Customization & R&D Capabilities.
5. "market_analysis": 7-8 detailed paragraphs covering Industry Size & CAGR Growth, Total Addressable Market (TAM/SAM/SOM) Analysis, Target B2B Customer Segments, Marketing Strategy & B2B Digital Trade Linkages, Competitive Positioning & Pricing Strategy, Export Opportunities, and Customer Retention Strategy.
6. "technical_feasibility": 7-8 detailed paragraphs covering Plant Machinery & Automation Technology, Factory Site Layout & Workspace Specifications, Power Grid & Auxillary DG Backup, Water Supply & Zero Liquid Discharge (ZLD), Safety & Occupational Health Systems, Preventive Maintenance Schedule, and Waste Minimization Tech.
7. "risk_analysis": 7-8 detailed paragraphs covering Operational & Machine Downtime Risk, Raw Material Volatility Risk, Credit Risk & Receivables Management, Power & Utility Interruption Risk, Environmental & Regulatory Compliance Risk, Overall Risk Scorecard, Downside Financial Sensitivity Risk, and Contingency Planning.
8. "swot_analysis": 7-8 detailed paragraphs detailing Strengths, Weaknesses, Opportunities, Threats, Strategic Mitigation Roadmap, Key Success Factors, Competitive Moat, and Long-Term Value Creation.
9. "cost_and_means": 7-8 detailed paragraphs covering Civil Works & Building Shed Cost Rationale, Plant Machinery Cost Breakdown, Utilities & Contingency Provisions, Promoter Equity Injection Plan, Debt Financing Structure, Pre-Operative Expense Allocation, Working Capital Margin Rationale, and Price Escalation Buffer.
10. "land_shed_infrastructure": 7-8 detailed paragraphs covering Factory Site Suitability & Location Advantages, Soil Load Bearing & Floor Specifications, Industrial Power & Water Hookups, Freight Logistics & Highway Access, Telecommunications & Connectivity, Environmental Suitability, Expansion Capacity, and Lease/Ownership Terms.
"""

        schema_part1 = {
            "type": "object",
            "properties": {
                "exec_summary": {"type": "string"},
                "business_overview": {"type": "string"},
                "project_background": {"type": "string"},
                "product_description": {"type": "string"},
                "market_analysis": {"type": "string"},
                "technical_feasibility": {"type": "string"},
                "risk_analysis": {"type": "string"},
                "swot_analysis": {"type": "string"},
                "cost_and_means": {"type": "string"},
                "land_shed_infrastructure": {"type": "string"}
            },
            "required": ["exec_summary", "business_overview", "project_background", "product_description", "market_analysis", "technical_feasibility", "risk_analysis", "swot_analysis", "cost_and_means", "land_shed_infrastructure"]
        }

        prompt_part2 = base_info + """
Return a JSON object with the following keys containing multi-paragraph detailed HTML text (7-8 detailed paragraphs per key):
11. "youth_empowerment": 7-8 detailed paragraphs covering Local Employment Generation, Women Empowerment & Gender Diversity, Skill Building & Apprenticeships, Rural Distress Migration Prevention, Vendor & Micro-Supplier Upliftment, Employee Health & Safety Standards, Social Security Provisions, and Community Engagement.
12. "end_products_quality": 7-8 detailed paragraphs covering Quality Assurance Protocols, 3D Metrology & CMM Inspection, Quality Certifications (ISO 9001:2015), Calibration Standards, Defect Prevention & Lean Quality Management, Testing Laboratory Equipment, Customer Complaint Resolution, and Continuous Improvement Framework.
13. "financial_viability": 7-8 detailed paragraphs covering Profitability & Operating Margins, Debt Service Coverage Ratio (DSCR) Cushion, Break-Even Point (BEP) Analysis, Net Present Value (NPV) & IRR Justification, Debt Repayment Sensitivity, Payback Period Analysis, Return on Capital Employed (ROCE), and Asset Turnover Ratios.
14. "tandon_working_capital": 7-8 detailed paragraphs covering Working Capital Norms (Tandon Committee MPBF Method I & II), Operating Cycle Analysis (Raw Material, WIP, Finished Goods, Receivables), Liquidity & Credit Terms Management, Bank Holding Norms, Receivables Discounting, Supplier Credit Terms, Margin Money Rationale, and Liquidity Risk Buffers.
15. "esg_sustainability": 7-8 detailed paragraphs covering ESG Audit Rating & Carbon Reduction, Energy Efficiency & Renewable Energy Interventions, ETP/ZLD Effluent Treatment, Workplace Health & Safety Compliance, Circular Scrap Recycling, Green Building Practices, Carbon Footprint Accounting, and Corporate Social Responsibility (CSR).
16. "tcrm_technology_readiness": 7-8 detailed paragraphs covering Technology Readiness Level Audit (TRL 9), Commercial Provenness & Track Record, OEM Equipment Sourcing Security, Technology Upgrade Roadmap, Patent & Intellectual Property Landscape, Industry 4.0 IoT Integration, Cyber-Physical Systems, and Maintenance Automation.
17. "projections_10yr_narrative": 7-8 detailed paragraphs covering Extended 10-Year Growth Outlook, Balance Sheet Net Worth Compounding, Free Cash Flow Accumulation, Debt-Free Financial Status Post Year 5, Greenfield Expansion Capacity, Dividend Policy Rationale, Retained Earnings Strategy, and Long-Term Solvency.
18. "monthly_cashflow_narrative": 7-8 detailed paragraphs covering 36-Month Liquidity & Working Capital Management, Peak Inventory Cash Buffer, Seasonal Collections Management, Emergency Liquidity Reserves, Cash Burn Analysis, Working Capital Limits Utilization, Monthly Debt Servicing Cushion, and Contingency Reserve Management.
19. "boq_narrative": 7-8 detailed paragraphs covering Bill of Quantities & Raw Material Sourcing, Vendor Qualification & Supplier Diversity, Material Storage & Inventory Holding Norms, Import vs Indigenous Procurement, Quality Certification of Raw Materials, Lead Time Management, Scrap Utilization, and Rate Contract Terms.
20. "manpower_narrative": 7-8 detailed paragraphs covering Organizational Hierarchy & Staffing Plan, Skill Requirements & Training Programs, Wages Structure & State Minimum Wage Compliance, Incentive Structure & Welfare Measures, Recruitment Strategy, Retention & PF/ESI Benefits, Technical Consultant Network, and Shift Wise Personnel Distribution.
21. "sensitivity_narrative": 7-8 detailed paragraphs covering Stress Testing Scenarios (Revenue Drop / CAPEX Inflation), Downside DSCR Cushion, Debt Servicing Safety Margin, Raw Material Price Spike Sensitivity, Interest Rate Risk Analysis, Capacity Utilization Shock Test, Combined Stress Scenario, and Loan Covenants Compliance.
22. "scheme_subsidy_narrative": 7-8 detailed paragraphs covering Applicable Central & State Schemes (PMEGP/PMFME/State MSME Policy), DIC Approval & Margin Money Claim Process, Tariff & Tax Exemptions, Interest Subvention Guidelines, Capital Grant Disbursement Stages, Escrow Account Mechanics, Compliance Filing Schedule, and Subsidy Impact on DSCR.
23. "marketing_distribution_narrative": 7-8 detailed paragraphs covering Offtake Contracts & B2B Distribution Channels, GeM & Digital B2B Trade Linkages, Technical Expos & Corporate Account Management, Volume Pricing & Credit Terms, OEM Partner Onboarding, Branding & Digital Marketing, Export Distribution Network, and Sales Force Incentives.
24. "statutory_compliance_narrative": 7-8 detailed paragraphs covering Statutory Registrations (GST, Udyam, PAN), Pollution Control Board CTE/CTO Approvals, Factory License & Fire NOC, Annual Governance Calendar, Labor Law Compliances, Environmental Audit Reports, Safety Clearance Certificates, and Tax Compliance Record.
25. "conclusion_narrative": 7-8 detailed paragraphs covering Bank Term Loan Recommendation & Sanction Rationale, Economic Contribution & Employment Generation, Financial Viability Summary, National Priorities Alignment, Promoter Commitment Rationale, Risk-Adjusted Return Profile, Social Welfare Value, and Final Loan Approval Request.
"""

        schema_part2 = {
            "type": "object",
            "properties": {
                "youth_empowerment": {"type": "string"},
                "end_products_quality": {"type": "string"},
                "financial_viability": {"type": "string"},
                "tandon_working_capital": {"type": "string"},
                "esg_sustainability": {"type": "string"},
                "tcrm_technology_readiness": {"type": "string"},
                "projections_10yr_narrative": {"type": "string"},
                "monthly_cashflow_narrative": {"type": "string"},
                "boq_narrative": {"type": "string"},
                "manpower_narrative": {"type": "string"},
                "sensitivity_narrative": {"type": "string"},
                "scheme_subsidy_narrative": {"type": "string"},
                "marketing_distribution_narrative": {"type": "string"},
                "statutory_compliance_narrative": {"type": "string"},
                "conclusion_narrative": {"type": "string"}
            },
            "required": [
                "youth_empowerment", "end_products_quality", "financial_viability",
                "tandon_working_capital", "esg_sustainability", "tcrm_technology_readiness",
                "projections_10yr_narrative", "monthly_cashflow_narrative", "boq_narrative",
                "manpower_narrative", "sensitivity_narrative", "scheme_subsidy_narrative",
                "marketing_distribution_narrative", "statutory_compliance_narrative", "conclusion_narrative"
            ]
        }

        narratives = {}
        try:
            res1 = provider.structured_generate(prompt_part1, schema_part1, system_instruction)
            if isinstance(res1, dict):
                narratives.update(res1)
        except Exception as e:
            print(f"[DPRContentEngine Notice] Gemini Part 1 generation error: {e}")

        try:
            res2 = provider.structured_generate(prompt_part2, schema_part2, system_instruction)
            if isinstance(res2, dict):
                narratives.update(res2)
        except Exception as e:
            print(f"[DPRContentEngine Notice] Gemini Part 2 generation error: {e}")

        return narratives

