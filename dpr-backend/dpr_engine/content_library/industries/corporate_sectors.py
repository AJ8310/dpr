from typing import Dict, Any
from dpr_engine.data_model import DPRDocumentModel

def safe_float(v, default: float = 0.0) -> float:
    if v is None:
        return default
    if isinstance(v, (int, float)):
        return float(v)
    try:
        s = str(v).replace('₹', '').replace(',', '').replace('Cr', '').replace('Lakhs', '').replace('%', '').replace('Years', '').replace('Sq.Ft', '').strip()
        return float(s)
    except Exception:
        return default

class CorporateSectorsNarrative:

    @staticmethod
    def get_solar_energy_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        b_name = doc.business_name or "Solar Park Enterprise"
        total_cost = safe_float(doc.total_cost, 450000000.0)
        promoter_contribution = safe_float(doc.promoter_contribution, 135000000.0)
        bank_loan = safe_float(doc.bank_loan, 315000000.0)
        corporate_npv = safe_float(doc.corporate_npv, 85000000.0)
        corporate_wacc = safe_float(doc.corporate_wacc, 10.5)
        corporate_project_irr = safe_float(doc.corporate_project_irr, 18.5)
        corporate_equity_irr = safe_float(doc.corporate_equity_irr, 24.2)

        return {
            "exec_summary": (
                f"<p><strong>1.1 Strategic Renewable Energy Mandate:</strong><br>"
                f"{b_name} is a high-yield grid-connected Solar Photovoltaic (PV) Renewable Power Generation Project located in {doc.district}, {doc.state}. "
                f"The facility is designed to generate clean electric power under a 25-year Power Purchase Agreement (PPA) with state electricity distribution utility companies (ESCOMs) "
                f"and corporate third-party open-access industrial off-takers.</p>"
                f"<p><strong>1.2 Financial Outlay & Valuation Summary:</strong><br>"
                f"Total project capital expenditure: <strong>₹{total_cost:,.2f}</strong>, backed by promoter equity of <strong>₹{promoter_contribution:,.2f}</strong> and debt financing of <strong>₹{bank_loan:,.2f}</strong>. "
                f"Corporate valuation metrics confirm high financial returns: Discounted Cash Flow Net Present Value (NPV) of <strong>₹{corporate_npv:,.2f}</strong> at a WACC of <strong>{corporate_wacc:.1f}%</strong>, "
                f"Project IRR of <strong>{corporate_project_irr:.1f}%</strong>, and Equity IRR of <strong>{corporate_equity_irr:.1f}%</strong>.</p>"
            ),
            "business_overview": (
                f"<p><strong>2.1 Institutional Project Developer Profile:</strong><br>"
                f"{b_name} holds approved grid interconnection clearance, KERC / CERC regulatory registrations, and CEIG safety approvals. "
                f"The management team possesses deep expertise in utility-scale solar EPC, HV substation engineering, and power trading.</p>"
            ),
            "project_background": (
                f"<p><strong>3.1 National Solar Energy Transition:</strong><br>"
                f"India has targeted 500 GW of non-fossil energy capacity by 2030. High solar irradiation levels in {doc.state} provide optimal conditions for utility-scale solar generation.</p>"
            ),
            "product_description": (
                f"<p><strong>4.1 Clean Electric Power Output:</strong><br>"
                f"Primary Deliverable: Renewable Solar Electric Energy (HSN Code: 27160000). Target Annual Capacity Generation: High CUF (>24%) with automated SCADA tracking.</p>"
            ),
            "market_analysis": (
                f"<p><strong>5.1 Power Off-take Market & Tariff Guarantee:</strong><br>"
                f"Off-take security is anchored by 25-year long-term PPAs and credit-guaranteed escrow mechanisms under state renewable energy procurement policies.</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 Photovoltaic Engineering Specs:</strong><br>"
                f"Utilizes high-efficiency TOPCon Monocrystalline bifacial solar modules (>680Wp rating) paired with single-axis automated solar trackers to achieve a Performance Ratio (PR) > 81.5%. "
                f"Interconnection is established at 33kV/110kV substation level under KERC/CERC grid code standards with SCADA real-time monitoring.</p>"
            ),
            "risk_analysis": (
                f"<p><strong>7.1 Grid & Insolation Risk Mitigation:</strong><br>"
                f"Insolation risk is mitigated via 25-year satellite solar resource data modeling; grid curtailment risk is secured via priority-must-run dispatch status under Indian Grid Code regulations.</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 Strengths:</strong> Long-term 25-year PPA revenue visibility, TOPCon bifacial modules, low operating OPEX.</p>"
                f"<p><strong>8.2 Weaknesses:</strong> Upfront capital intensive land procurement.</p>"
                f"<p><strong>8.3 Opportunities:</strong> Green hydrogen integration and corporate open-access expansion.</p>"
                f"<p><strong>8.4 Threats:</strong> Grid transmission congestion and regulatory tariff renegotiations.</p>"
            ),
            "conclusion": (
                f"<p><strong>9.1 Recommendation:</strong><br>"
                f"With positive NPV of ₹{doc.corporate_npv:,.2f} and Project IRR of {doc.corporate_project_irr:.1f}%, the term loan request of ₹{doc.bank_loan:,.2f} is strongly recommended for financial approval.</p>"
            )
        }

    @staticmethod
    def get_ev_battery_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        b_name = doc.business_name or "EV Battery Giga Project"
        return {
            "exec_summary": (
                f"<p><strong>1.1 Advanced Electric Vehicle Energy Storage Mandate:</strong><br>"
                f"{b_name} is an advanced Lithium-ion Battery Pack and Energy Storage System (ESS) manufacturing facility in {doc.district}, {doc.state}. "
                f"Conforms to PLI (Production Linked Incentive) scheme norms for Advanced Chemistry Cell (ACC) battery storage. Total CAPEX: <strong>₹{doc.total_cost:,.2f}</strong>, Project IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{doc.corporate_npv:,.2f}</strong>.</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 Giga-Factory Automated Assembly Line:</strong><br>"
                f"Features automated laser welding, cell grading, Battery Management System (BMS) integration, and thermal runaway containment. "
                f"Equipped with ISO 14644-1 Class 7 dry rooms (dew point -40°C) for high-precision cell assembly.</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 Strengths:</strong> PLI scheme incentive coverage, automated laser welding, high-density cell architecture.</p>"
                f"<p><strong>8.2 Weaknesses:</strong> Raw material import dependencies for lithium/cobalt cells.</p>"
                f"<p><strong>8.3 Opportunities:</strong> Rapid EV 2W/3W adoption and telecom BESS energy storage demand.</p>"
                f"<p><strong>8.4 Threats:</strong> Cell chemistry technological shifts.</p>"
            ),
            "conclusion": (
                f"<p><strong>9.1 Recommendation:</strong> The project request for bank term loan facility of ₹{doc.bank_loan:,.2f} is strongly recommended for financial sanction.</p>"
            )
        }

    @staticmethod
    def get_pharma_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        b_name = doc.business_name or "Pharma Formulations Enterprise"
        return {
            "exec_summary": (
                f"<p><strong>1.1 WHO-GMP Compliant Formulations Mandate:</strong><br>"
                f"{b_name} is a WHO-GMP and US-FDA compliant pharmaceutical formulation and Active Pharmaceutical Ingredient (API) facility in {doc.district}, {doc.state}. "
                f"Total CAPEX: <strong>₹{doc.total_cost:,.2f}</strong>, Project IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{doc.corporate_npv:,.2f}</strong>.</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 Sterile Reaction & Lyophilization Setup:</strong><br>"
                f"Equipped with SS316L sterile reaction vessels, lyophilizers, and Zero Liquid Discharge (ZLD) effluent treatment plant. "
                f"Operates under strict cGMP protocols with automated 21 CFR Part 11 compliant data integrity controls.</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 Strengths:</strong> WHO-GMP & cGMP certification, SS316L cleanrooms, 21 CFR Part 11 compliance.</p>"
                f"<p><strong>8.2 Weaknesses:</strong> High regulatory audit and validation costs.</p>"
                f"<p><strong>8.3 Opportunities:</strong> Expanding generic medicine exports and domestic healthcare demand.</p>"
                f"<p><strong>8.4 Threats:</strong> Strict US-FDA audit inspections and API raw material cost spikes.</p>"
            ),
            "conclusion": (
                f"<p><strong>9.1 Recommendation:</strong> Financial loan request of ₹{doc.bank_loan:,.2f} is strongly recommended for approval.</p>"
            )
        }

    @staticmethod
    def get_data_center_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        b_name = doc.business_name or "Cloud Data Center Infrastructure"
        return {
            "exec_summary": (
                f"<p><strong>1.1 Tier-IV Hyperscale Data Center Mandate:</strong><br>"
                f"{b_name} is a Tier-IV Hyperscale Data Center and Enterprise Cloud Infrastructure facility in {doc.district}, {doc.state}. "
                f"Total CAPEX: <strong>₹{doc.total_cost:,.2f}</strong>, Project IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{doc.corporate_npv:,.2f}</strong>.</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 Hyperscale Cooling & Redundant Infrastructure:</strong><br>"
                f"Designed for PUE (Power Usage Effectiveness) < 1.35 with liquid immersion cooling and dual redundant 110kV grid power feeds. "
                f"N+N UPS power redundancy, ISO 27001 cybersecurity certification, and carrier-neutral fiber connectivity.</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 Strengths:</strong> Tier-IV SLA uptime, PUE < 1.35 liquid cooling, ISO 27001 security.</p>"
                f"<p><strong>8.2 Weaknesses:</strong> High power consumption and continuous capital reinvestment.</p>"
                f"<p><strong>8.3 Opportunities:</strong> Data localization laws and AI/ML compute workloads expansion.</p>"
                f"<p><strong>8.4 Threats:</strong> Power tariff hikes and cyber security threats.</p>"
            ),
            "conclusion": (
                f"<p><strong>9.1 Recommendation:</strong> Bank loan request of ₹{doc.bank_loan:,.2f} is strongly recommended for sanction.</p>"
            )
        }
