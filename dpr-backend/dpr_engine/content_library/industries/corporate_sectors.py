from typing import Dict, Any
from dpr_engine.data_model import DPRDocumentModel
from dpr_engine.utils.currency import format_inr

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
        lang = str(getattr(doc, 'language', 'en') or 'en').lower()

        if 'kn' in lang or 'kannada' in lang:
            return {
                "exec_summary": (
                    f"<p><strong>1.1 ಕಾರ್ಯತಂತ್ರದ ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಯೋಜನೆ:</strong><br>"
                    f"{b_name} ಒಂದು ಉನ್ನತ ಇಳುವರಿಯ ಗ್ರಿಡ್-ಸಂಪರ್ಕಿತ ಸೌರ ದ್ಯುತಿವಿದ್ಯುಜ್ಜನಕ (PV) ನವೀಕರಿಸಬಹುದಾದ ವಿದ್ಯುತ್ ಉತ್ಪಾದನಾ ಯೋಜನೆಯಾಗಿದ್ದು, {doc.district}, {doc.state} ನಲ್ಲಿ ನೆಲೆಗೊಂಡಿದೆ. "
                    f"ರಾಜ್ಯ ವಿದ್ಯುತ್ ಸರಬರಾಜು ಕಂಪನಿಗಳೊಂದಿಗೆ (ESCOMs) ಮತ್ತು ಕೈಗಾರಿಕಾ ಗ್ರಾಹಕರೊಂದಿಗೆ 25-ವರ್ಷಗಳ ವಿದ್ಯುತ್ ಖರೀದಿ ಒಪ್ಪಂದದ (PPA) ಅಡಿಯಲ್ಲಿ ಸ್ವಚ್ಛ ವಿದ್ಯುತ್ ಶಕ್ತಿಯನ್ನು ಉತ್ಪಾದಿಸಲು ಈ ಘಟಕವನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.</p>"
                    f"<p><strong>1.2 ಆರ್ಥಿಕ ವೆಚ್ಚ ಮತ್ತು ಮೌಲ್ಯಮಾಪನ ಸಾರಾಂಶ:</strong><br>"
                    f"ಒಟ್ಟು ಯೋಜನಾ ಬಂಡವಾಳ ವೆಚ್ಚ: <strong>₹{format_inr(total_cost)}</strong>, ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ <strong>₹{format_inr(promoter_contribution)}</strong> ಮತ್ತು ಬ್ಯಾಂಕ್ ಸಾಲ <strong>₹{format_inr(bank_loan)}</strong> ಬೆಂಬಲದೊಂದಿಗೆ. "
                    f"ಕಾರ್ಪೊರೇಟ್ ಮೌಲ್ಯಮಾಪನ ಮಾನದಂಡಗಳು ಉನ್ನತ ಆದಾಯವನ್ನು ಖಚಿತಪಡಿಸುತ್ತವೆ: WACC <strong>{corporate_wacc:.1f}%</strong> ನಲ್ಲಿ ರಿಯಾಯಿತಿ ನಗದು ಹರಿವಿನ ನಿವ್ವಳ ಪ್ರಸ್ತುತ ಮೌಲ್ಯ (NPV) <strong>₹{format_inr(corporate_npv)}</strong>, "
                    f"ಯೋಜನಾ IRR <strong>{corporate_project_irr:.1f}%</strong>, ಮತ್ತು ಇಕ್ವಿಟಿ IRR <strong>{corporate_equity_irr:.1f}%</strong>.</p>"
                ),
                "business_overview": (
                    f"<p><strong>2.1 ಸಾಂಸ್ಥಿಕ ಯೋಜನಾ ಡೆವಲಪರ್ ಪ್ರೊಫೈಲ್:</strong><br>"
                    f"{b_name} ಅನುಮೋದಿತ ಗ್ರಿಡ್ ಇಂಟರ್‌ಕನೆಕ್ಷನ್ ಕ್ಲಿಯರೆನ್ಸ್, KERC / CERC ನಿಯಂತ್ರಕ ನೋಂದಣಿಗಳು ಮತ್ತು CEIG ಸುರಕ್ಷತಾ ಅನುಮೋದನೆಗಳನ್ನು ಹೊಂದಿದೆ. "
                    f"ಯೋಜನಾ ನಿರ್ವಹಣಾ ತಂಡವು ಸೌರ EPC, ಉಪಕೇಂದ್ರ ಎಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ವಿದ್ಯುತ್ ವ್ಯಾಪಾರದಲ್ಲಿ ಆಳವಾದ ಅನುಭವವನ್ನು ಹೊಂದಿದೆ.</p>"
                ),
                "project_background": (
                    f"<p><strong>3.1 ರಾಷ್ಟ್ರೀಯ ಸೌರ ಶಕ್ತಿ ಪರಿವರ್ತನೆ:</strong><br>"
                    f"ಭಾರತವು 2030 ರ ವೇಳೆಗೆ 500 GW ಪಳೆಯುಳಿಕೆಯೇತರ ಇಂಧನ ಸಾಮರ್ಥ್ಯವನ್ನು ಗುರಿಯಾಗಿಸಿಕೊಂಡಿದೆ. {doc.state} ರಾಜ್ಯದಲ್ಲಿ ಲಭ್ಯವಿರುವ ಅತ್ಯುತ್ತಮ ಸೌರ ವಿಕಿರಣವು ಯೋಜನೆಗೆ ಸೂಕ್ತ ಪರಿಸರವನ್ನು ಒದಗಿಸುತ್ತದೆ.</p>"
                ),
                "product_description": (
                    f"<p><strong>4.1 ಸ್ವಚ್ಛ ವಿದ್ಯುತ್ ಉತ್ಪಾದನೆ:</strong><br>"
                    f"ಪ್ರಾಥಮಿಕ ವಿತರಣೆ: ನವೀಕರಿಸಬಹುದಾದ ಸೌರ ವಿದ್ಯುತ್ ಶಕ್ತಿ (HSN ಕೋಡ್: 27160000). ಸ್ವಯಂಚಾಲಿತ SCADA ಟ್ರ್ಯಾಕಿಂಗ್‌ನೊಂದಿಗೆ ಅತ್ಯುನ್ನತ CUF (>24%).</p>"
                ),
                "market_analysis": (
                    f"<p><strong>5.1 ವಿದ್ಯುತ್ ಖರೀದಿ ಮಾರುಕಟ್ಟೆ ಮತ್ತು ದರ ಖಾತರಿ:</strong><br>"
                    f"ರಾಜ್ಯ ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಸಂಗ್ರಹಣೆ ನೀತಿಗಳ ಅಡಿಯಲ್ಲಿ 25-ವರ್ಷಗಳ ದೀರ್ಘಾವಧಿಯ PPA ಗಳು ಮತ್ತು ಎಸ್ಕ್ರೋ ಕಾರ್ಯವಿಧಾನಗಳಿಂದ ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆಯನ್ನು ಭದ್ರಪಡಿಸಲಾಗಿದೆ.</p>"
                ),
                "technical_feasibility": (
                    f"<p><strong>6.1 ತಾಂತ್ರಿಕ ಕಾರ್ಯಸಾಧ್ಯತೆ ಮತ್ತು ಇಂಜಿನಿಯರಿಂಗ್ ವಿವರಣೆ:</strong><br>"
                    f"ಹೆಚ್ಚಿನ ದಕ್ಷತೆಯ TOPCon ಮಾನೋಕ್ರಿಸ್ಟಲಿನ್ ಬೈಫೇಸಿಯಲ್ ಸೋಲಾರ್ ಮಾಡ್ಯೂಲ್‌ಗಳು (>680Wp ರೇಟಿಂಗ್) ಮತ್ತು ಸಿಂಗಲ್-ಆಕ್ಸಿಸ್ ಸ್ವಯಂಚಾಲಿತ ಸೌರ ಟ್ರ್ಯಾಕರ್‌ಗಳನ್ನು ಬಳಸಿಕೊಳ್ಳುತ್ತದೆ (PR > 81.5%). "
                    f"KERC/CERC ಗ್ರಿಡ್ ಕೋಡ್ ಮಾನದಂಡಗಳ ಅಡಿಯಲ್ಲಿ 33kV/110kV ಉಪಕೇಂದ್ರ ಮಟ್ಟದಲ್ಲಿ SCADA ನೈಜ-ಸಮಯದ ಮೇಲ್ವಿಚಾರಣೆಯೊಂದಿಗೆ ಸಂಪರ್ಕ ಕಲ್ಪಿಸಲಾಗಿದೆ.</p>"
                ),
                "risk_analysis": (
                    f"<p><strong>7.1 ಅಪಾಯ ನಿರ್ವಹಣೆ ಮತ್ತು ತಗ್ಗಿಸುವಿಕೆ:</strong><br>"
                    f"ಸೌರ ಸಂಪನ್ಮೂಲ ಮಾದರಿಯ ಮೂಲಕ ಸೌರ ವಿಕಿರಣದ ಅಪಾಯವನ್ನು ತಗ್ಗಿಸಲಾಗಿದೆ; ಗ್ರಿಡ್ ಕಡಿತದ ಅಪಾಯವನ್ನು ಆದ್ಯತೆಯ 'ಮಸ್ಟ್-ರನ್' ವಿತರಣಾ ಸ್ಥಾನಮಾನದ ಮೂಲಕ ಭದ್ರಪಡಿಸಲಾಗಿದೆ.</p>"
                ),
                "swot_analysis": (
                    f"<p><strong>8.1 ಸಾಮರ್ಥ್ಯಗಳು:</strong> 25-ವರ್ಷಗಳ ದೀರ್ಘಾವಧಿಯ PPA ಆದಾಯ ಭದ್ರತೆ, TOPCon ಮಾಡ್ಯೂಲ್‌ಗಳು, ಕಡಿಮೆ ನಿರ್ವಹಣಾ ವೆಚ್ಚ (OPEX).</p>"
                    f"<p><strong>8.2 ದೌರ್ಬಲ್ಯಗಳು:</strong> ಆರಂಭಿಕ ಹೆಚ್ಚಿನ ಭೂಮಿ ಖರೀದಿ ವೆಚ್ಚ.</p>"
                    f"<p><strong>8.3 ಅವಕಾಶಗಳು:</strong> ಹಸಿರು ಹೈಡ್ರೋಜನ್ ಸಂಯೋಜನೆ ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಓಪನ್-ಆಕ್ಸೆಸ್ ವಿಸ್ತರಣೆ.</p>"
                    f"<p><strong>8.4 ಸವಾಲುಗಳು:</strong> ಗ್ರಿಡ್ ಪ್ರಸರಣ ದಟ್ಟಣೆ ಮತ್ತು ನಿಯಂತ್ರಕ ದರ ಮರುಸಂಧಾನಗಳು.</p>"
                ),
                "conclusion": (
                    f"<p><strong>9.1 ಅಂತಿಮ ಶಿಫಾರಸು:</strong><br>"
                    f"ಧನಾತ್ಮಕ NPV ₹{format_inr(doc.corporate_npv)} ಮತ್ತು ಯೋಜನಾ IRR {doc.corporate_project_irr:.1f}% ನೊಂದಿಗೆ, ₹{format_inr(doc.bank_loan)} ಗಳ ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲವನ್ನು ಮಂಜೂರು ಮಾಡಲು ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.</p>"
                )
            }

        return {
            "exec_summary": (
                f"<p><strong>1.1 Strategic Renewable Energy Mandate:</strong><br>"
                f"{b_name} is a high-yield grid-connected Solar Photovoltaic (PV) Renewable Power Generation Project located in {doc.district}, {doc.state}. "
                f"The facility is designed to generate clean electric power under a 25-year Power Purchase Agreement (PPA) with state electricity distribution utility companies (ESCOMs) "
                f"and corporate third-party open-access industrial off-takers.</p>"
                f"<p><strong>1.2 Financial Outlay & Valuation Summary:</strong><br>"
                f"Total project capital expenditure: <strong>₹{format_inr(total_cost)}</strong>, backed by promoter equity of <strong>₹{format_inr(promoter_contribution)}</strong> and debt financing of <strong>₹{format_inr(bank_loan)}</strong>. "
                f"Corporate valuation metrics confirm high financial returns: Discounted Cash Flow Net Present Value (NPV) of <strong>₹{format_inr(corporate_npv)}</strong> at a WACC of <strong>{corporate_wacc:.1f}%</strong>, "
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
                f"With positive NPV of ₹{format_inr(doc.corporate_npv)} and Project IRR of {doc.corporate_project_irr:.1f}%, the term loan request of ₹{format_inr(doc.bank_loan)} is strongly recommended for financial approval.</p>"
            )
        }

    @staticmethod
    def get_ev_battery_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        b_name = doc.business_name or "EV Battery Giga Project"
        lang = str(getattr(doc, 'language', 'en') or 'en').lower()
        if 'kn' in lang or 'kannada' in lang:
            return {
                "exec_summary": (
                    f"<p><strong>1.1 ಮುಂದುವರಿದ ಎಲೆಕ್ಟ್ರಿಕ್ ವೆಹಿಕಲ್ ಇಂಧನ ಶೇಖರಣಾ ಯೋಜನೆ:</strong><br>"
                    f"{b_name} {doc.district}, {doc.state} ನಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ಸುಧಾರಿತ ಲಿಥಿಯಂ-ಐಯಾನ್ ಬ್ಯಾಟರಿ ಪ್ಯಾಕ್ ಮತ್ತು ಶಕ್ತಿ ಶೇಖರಣಾ ವ್ಯವಸ್ಥೆ (ESS) ಉತ್ಪಾದನಾ ಘಟಕವಾಗಿದೆ. "
                    f"ಸುಧಾರಿತ ರಸಾಯನಶಾಸ್ತ್ರ ಕೋಶ (ACC) ಬ್ಯಾಟರಿ ಶೇಖರಣೆಗಾಗಿ PLI (ಉತ್ಪಾದನೆ-ಸಂಯೋಜಿತ ಪ್ರೋತ್ಸಾಹ) ಯೋಜನೆ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ. "
                    f"ಒಟ್ಟು ಬಂಡವಾಳ ವೆಚ್ಚ: <strong>₹{format_inr(doc.total_cost)}</strong>, ಯೋಜನಾ IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{format_inr(doc.corporate_npv)}</strong>.</p>"
                ),
                "technical_feasibility": (
                    f"<p><strong>6.1 ಗಿಗಾ-ಫ್ಯಾಕ್ಟರಿ ಸ್ವಯಂಚಾಲಿತ ಅಸೆಂಬ್ಲಿ ಲೈನ್:</strong><br>"
                    f"ಸ್ವಯಂಚಾಲಿತ ಲೇಸರ್ ವೆಲ್ಡಿಂಗ್, ಸೆಲ್ ಗ್ರೇಡಿಂಗ್, ಬ್ಯಾಟರಿ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ಸಿಸ್ಟಮ್ (BMS) ಏಕೀಕರಣ ಮತ್ತು ಥರ್ಮಲ್ ರನ್‌ಅವೇ ಸುರಕ್ಷತೆಯನ್ನು ಒಳಗೊಂಡಿದೆ. "
                    f"ಉನ್ನತ-ನಿಖರತೆಯ ಸೆಲ್ ಅಸೆಂಬ್ಲಿಗಾಗಿ ISO 14644-1 ಕ್ಲಾಸ್ 7 ಡ್ರೈ ರೂಮ್‌ಗಳನ್ನು ಹೊಂದಿದೆ.</p>"
                ),
                "swot_analysis": (
                    f"<p><strong>8.1 ಸಾಮರ್ಥ್ಯಗಳು:</strong> PLI ಯೋಜನೆಯ ಪ್ರೋತ್ಸಾಹ, ಸ್ವಯಂಚಾಲಿತ ಲೇಸರ್ ವೆಲ್ಡಿಂಗ್, ಹೆಚ್ಚಿನ ಸಾಂದ್ರತೆಯ ಬ್ಯಾಟರಿ ರಚನೆ.</p>"
                    f"<p><strong>8.2 ದೌರ್ಬಲ್ಯಗಳು:</strong> ಲಿಥಿಯಂ ಮತ್ತು ಕೋಬಾಲ್ಟ್ ಕಚ್ಚಾ ವಸ್ತುಗಳಿಗೆ ಆಮದು ಅವಲಂಬನೆ.</p>"
                    f"<p><strong>8.3 ಅವಕಾಶಗಳು:</strong> ದೇಶೀಯ ಇವಿ ವಾಹನಗಳ ಹೆಚ್ಚಳ ಮತ್ತು ಟೆಲಿಕಾಂ BESS ಇಂಧನ ಸಂಗ್ರಹಣಾ ಬೇಡಿಕೆ.</p>"
                    f"<p><strong>8.4 ಸವಾಲುಗಳು:</strong> ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಕ್ಷಿಪ್ರ ಬದಲಾವಣೆಗಳು ಮತ್ತು ಕಚ್ಚಾ ವಸ್ತುಗಳ ಬೆಲೆ ಏರಿಳಿತ.</p>"
                ),
                "conclusion": (
                    f"<p><strong>9.1 ಶಿಫಾರಸು:</strong> ₹{format_inr(doc.bank_loan)} ಗಳ ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲವನ್ನು ಮಂಜೂರು ಮಾಡಲು ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.</p>"
                )
            }
        return {
            "exec_summary": (
                f"<p><strong>1.1 Advanced Electric Vehicle Energy Storage Mandate:</strong><br>"
                f"{b_name} is an advanced Lithium-ion Battery Pack and Energy Storage System (ESS) manufacturing facility in {doc.district}, {doc.state}. "
                f"Conforms to PLI (Production Linked Incentive) scheme norms for Advanced Chemistry Cell (ACC) battery storage. Total CAPEX: <strong>₹{format_inr(doc.total_cost)}</strong>, Project IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{format_inr(doc.corporate_npv)}</strong>.</p>"
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
                f"<p><strong>9.1 Recommendation:</strong> The project request for bank term loan facility of ₹{format_inr(doc.bank_loan)} is strongly recommended for financial sanction.</p>"
            )
        }

    @staticmethod
    def get_pharma_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        b_name = doc.business_name or "Pharma Formulations Enterprise"
        lang = str(getattr(doc, 'language', 'en') or 'en').lower()
        if 'kn' in lang or 'kannada' in lang:
            return {
                "exec_summary": (
                    f"<p><strong>1.1 WHO-GMP ಪ್ರಮಾಣೀಕೃತ ಔಷಧ ಸೂತ್ರೀಕರಣ ಘಟಕ:</strong><br>"
                    f"{b_name} {doc.district}, {doc.state} ನಲ್ಲಿ WHO-GMP ಮತ್ತು US-FDA ಕಂಪ್ಲೈಂಟ್ ಔಷಧೀಯ ಸೂತ್ರೀಕರಣ ಮತ್ತು ಸಕ್ರಿಯ ಔಷಧೀಯ ಪದಾರ್ಥಗಳ (API) ಉತ್ಪಾದನಾ ಸೌಲಭ್ಯವಾಗಿದೆ. "
                    f"ಒಟ್ಟು ಬಂಡವಾಳ ವೆಚ್ಚ: <strong>₹{format_inr(doc.total_cost)}</strong>, ಯೋಜನಾ IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{format_inr(doc.corporate_npv)}</strong>.</p>"
                ),
                "technical_feasibility": (
                    f"<p><strong>6.1 ಸ್ಟೆರೈಲ್ ರಿಯಾಕ್ಷನ್ ಮತ್ತು ಲೈಯೋಫಿಲೈಸೇಶನ್ ಸೌಲಭ್ಯ:</strong><br>"
                    f"SS316L ಸ್ಟೆರೈಲ್ ರಿಯಾಕ್ಷನ್ ವೆಸೆಲ್‌ಗಳು, ಲೈಯೋಫಿಲೈಸರ್‌ಗಳು ಮತ್ತು ಝೀರೋ ಲಿಕ್ವಿಡ್ ಡಿಸ್ಚಾರ್ಜ್ (ZLD) ತ್ಯಾಜ್ಯ ಸಂಸ್ಕರಣಾ ಘಟಕವನ್ನು ಹೊಂದಿದೆ. "
                    f"ಕಟ್ಟುನಿಟ್ಟಾದ cGMP ಪ್ರೋಟೋಕಾಲ್‌ಗಳು ಮತ್ತು 21 CFR Part 11 ನಿಯಮಗಳನ್ನು ಪಾಲಿಸುತ್ತದೆ.</p>"
                ),
                "swot_analysis": (
                    f"<p><strong>8.1 ಸಾಮರ್ಥ್ಯಗಳು:</strong> WHO-GMP ಪ್ರಮಾಣೀಕರಣ, SS316L ಕ್ಲೀನ್‌ರೂಮ್‌ಗಳು, cGMP ಅನುಸರಣೆ.</p>"
                    f"<p><strong>8.2 ದೌರ್ಬಲ್ಯಗಳು:</strong> ಹೆಚ್ಚಿನ ನಿಯಂತ್ರಕ ಆಡಿಟ್ ಮತ್ತು ಪ್ರಮಾಣೀಕರಣ ವೆಚ್ಚಗಳು.</p>"
                    f"<p><strong>8.3 ಅವಕಾಶಗಳು:</strong> ಜೆನೆರಿಕ್ ಔಷಧಿಗಳ ರಫ್ತು ವಿಸ್ತರಣೆ ಮತ್ತು ದೇಶೀಯ ಆರೋಗ್ಯ ಸೇವಾ ಬೇಡಿಕೆ.</p>"
                    f"<p><strong>8.4 ಸವಾಲುಗಳು:</strong> ಕಠಿಣ ನಿಯಂತ್ರಕ ತಪಾಸಣೆಗಳು ಮತ್ತು ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬೆಲೆ ಏರಿಕೆ.</p>"
                ),
                "conclusion": (
                    f"<p><strong>9.1 ಶಿಫಾರಸು:</strong> ₹{format_inr(doc.bank_loan)} ಗಳ ಬ್ಯಾಂಕ್ ಹಣಕಾಸು ಸಾಲವನ್ನು ಮಂಜೂರು ಮಾಡಲು ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.</p>"
                )
            }
        return {
            "exec_summary": (
                f"<p><strong>1.1 WHO-GMP Compliant Formulations Mandate:</strong><br>"
                f"{b_name} is a WHO-GMP and US-FDA compliant pharmaceutical formulation and Active Pharmaceutical Ingredient (API) facility in {doc.district}, {doc.state}. "
                f"Total CAPEX: <strong>₹{format_inr(doc.total_cost)}</strong>, Project IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{format_inr(doc.corporate_npv)}</strong>.</p>"
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
                f"<p><strong>9.1 Recommendation:</strong> Financial loan request of ₹{format_inr(doc.bank_loan)} is strongly recommended for approval.</p>"
            )
        }

    @staticmethod
    def get_data_center_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        b_name = doc.business_name or "Cloud Data Center Infrastructure"
        lang = str(getattr(doc, 'language', 'en') or 'en').lower()
        if 'kn' in lang or 'kannada' in lang:
            return {
                "exec_summary": (
                    f"<p><strong>1.1 ಶ್ರೇಣಿ-IV ಹೈಪರ್‌ಸ್ಕೇಲ್ ಡೇಟಾ ಸೆಂಟರ್ ಯೋಜನೆ:</strong><br>"
                    f"{b_name} {doc.district}, {doc.state} ನಲ್ಲಿ ಟೈರ್-IV ಹೈಪರ್‌ಸ್ಕೇಲ್ ಡೇಟಾ ಸೆಂಟರ್ ಮತ್ತು ಎಂಟರ್‌ಪ್ರೈಸ್ ಕ್ಲೌಡ್ ಮೂಲಸೌಕರ್ಯ ಸೌಲಭ್ಯವಾಗಿದೆ. "
                    f"ಒಟ್ಟು ಬಂಡವಾಳ ವೆಚ್ಚ: <strong>₹{format_inr(doc.total_cost)}</strong>, ಯೋಜನಾ IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{format_inr(doc.corporate_npv)}</strong>.</p>"
                ),
                "technical_feasibility": (
                    f"<p><strong>6.1 ಹೈಪರ್‌ಸ್ಕೇಲ್ ಕೂಲಿಂಗ್ ಮತ್ತು ಹೆಚ್ಚುವರಿ ಬ್ಯಾಕಪ್ ವ್ಯವಸ್ಥೆ:</strong><br>"
                    f"ದ್ರವ ಇಮ್ಮರ್ಶನ್ ಕೂಲಿಂಗ್ ಮತ್ತು ಡ್ಯುಯಲ್ 110kV ಗ್ರಿಡ್ ವಿದ್ಯುತ್ ಸಂಪರ್ಕದೊಂದಿಗೆ PUE < 1.35 ಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. "
                    f"N+N UPS ಬ್ಯಾಕಪ್, ISO 27001 ಸೈಬರ್ ಭದ್ರತಾ ಪ್ರಮಾಣೀಕರಣ ಮತ್ತು ಕ್ಯಾರಿಯರ್-ತಟಸ್ಥ ಫೈಬರ್ ಸಂಪರ್ಕವನ್ನು ಹೊಂದಿದೆ.</p>"
                ),
                "swot_analysis": (
                    f"<p><strong>8.1 ಸಾಮರ್ಥ್ಯಗಳು:</strong> ಟೈರ್-IV 99.995% ಅಪ್‌ಟೈಮ್, PUE < 1.35 ಶಕ್ತಿ ದಕ್ಷತೆ, ISO 27001 ಭದ್ರತೆ.</p>"
                    f"<p><strong>8.2 ದೌರ್ಬಲ್ಯಗಳು:</strong> ಹೆಚ್ಚಿನ ವಿದ್ಯುತ್ ಬಳಕೆ ಮತ್ತು ನಿರಂತರ ಬಂಡವಾಳ ಮರುಹೂಡಿಕೆ.</p>"
                    f"<p><strong>8.3 ಅವಕಾಶಗಳು:</strong> ಡೇಟಾ ಸ್ಥಳೀಕರಣ ನೀತಿಗಳು ಮತ್ತು AI/ML ಕಂಪ್ಯೂಟಿಂಗ್ ಬೇಡಿಕೆ ವಿಸ್ತರಣೆ.</p>"
                    f"<p><strong>8.4 ಸವಾಲುಗಳು:</strong> ವಿದ್ಯುತ್ ದರ ಹೆಚ್ಚಳ ಮತ್ತು ಸೈಬರ್ ಭದ್ರತಾ ಬೆದರಿಕೆಗಳು.</p>"
                ),
                "conclusion": (
                    f"<p><strong>9.1 ಶಿಫಾರಸು:</strong> ₹{format_inr(doc.bank_loan)} ಗಳ ಬ್ಯಾಂಕ್ ಸಾಲ ಸೌಲಭ್ಯವನ್ನು ಮಂಜೂರು ಮಾಡಲು ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.</p>"
                )
            }
        return {
            "exec_summary": (
                f"<p><strong>1.1 Tier-IV Hyperscale Data Center Mandate:</strong><br>"
                f"{b_name} is a Tier-IV Hyperscale Data Center and Enterprise Cloud Infrastructure facility in {doc.district}, {doc.state}. "
                f"Total CAPEX: <strong>₹{format_inr(doc.total_cost)}</strong>, Project IRR: <strong>{doc.corporate_project_irr:.1f}%</strong>, NPV: <strong>₹{format_inr(doc.corporate_npv)}</strong>.</p>"
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
                f"<p><strong>9.1 Recommendation:</strong> Bank loan request of ₹{format_inr(doc.bank_loan)} is strongly recommended for sanction.</p>"
            )
        }
