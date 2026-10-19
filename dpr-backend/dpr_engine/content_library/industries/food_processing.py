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

class FoodProcessingNarrative:

    @staticmethod
    def get_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        b_name = doc.business_name or "the Agro Enterprise"
        product = doc.primary_product or "processed organic food products"
        district = doc.district or "Mysuru"
        state = doc.state or "Karnataka"

        total_cost = safe_float(doc.total_cost, 15000000.0)
        land_cost = safe_float(doc.land_cost, 2000000.0)
        building_cost = safe_float(doc.building_cost, 3500000.0)
        electrification_cost = safe_float(doc.electrification_cost, 500000.0)
        working_capital = safe_float(doc.working_capital, 1500000.0)
        promoter_contribution = safe_float(doc.promoter_contribution, 3750000.0)
        bank_loan = safe_float(doc.bank_loan, 11250000.0)
        subsidy = safe_float(doc.subsidy, 1000000.0)
        avg_dscr = safe_float(doc.avg_dscr, 1.85)
        bep_percent = safe_float(doc.bep_percent, 48.5)
        corporate_project_irr = safe_float(doc.corporate_project_irr, 22.4)
        m_total = sum(safe_float(m.total) for m in doc.machinery) if doc.machinery else total_cost * 0.40

        lang = str(getattr(doc, 'language', 'en') or 'en').lower()
        if 'kn' in lang or 'kannada' in lang:
            return FoodProcessingNarrative._get_kannada_sections(doc, b_name, product, district, state, total_cost, land_cost, building_cost, electrification_cost, working_capital, promoter_contribution, bank_loan, subsidy, avg_dscr, bep_percent, corporate_project_irr, m_total)
        if 'hi' in lang or 'hindi' in lang:
            return FoodProcessingNarrative._get_hindi_sections(doc, b_name, product, district, state, total_cost, land_cost, building_cost, electrification_cost, working_capital, promoter_contribution, bank_loan, subsidy, avg_dscr, bep_percent, corporate_project_irr, m_total)

        return {
            "exec_summary": (
                f"<p><strong>1.1 Executive Overview & Agro-Industrial Rationale:</strong><br>"
                f"{b_name} is an integrated agro-food processing facility established in {district}, {state}. "
                f"The unit is dedicated to the hygienic processing, cold-milling, and MAP vacuum packaging of premium <strong>{product}</strong> "
                f"conforming to strict FSSAI Grade 1 food safety norms. The project bridges agricultural supply chain gaps by purchasing raw farm produce "
                f"directly from local Farmer Producer Organizations (FPOs), eliminating intermediary markups and enhancing farmer realization.</p>"
                f"<p><strong>1.2 Financial Outlay & Capital Allocation:</strong><br>"
                f"The project entails a total capital expenditure of <strong>₹{format_inr(total_cost)}</strong>. "
                f"Capital allocation comprises land site preparation (₹{format_inr(land_cost)}), food-grade sanitary processing shed construction (₹{format_inr(building_cost)}), "
                f"SS304 stainless steel food machinery (₹{format_inr(m_total)}), cold room storage infrastructure (₹{format_inr(electrification_cost)}), "
                f"and initial operational working capital (₹{format_inr(working_capital)}). Financing is structured via promoter equity contribution of "
                f"<strong>₹{format_inr(promoter_contribution)}</strong>, bank debt facility of <strong>₹{format_inr(bank_loan)}</strong>, and government PMFME capital subsidy claim of <strong>₹{format_inr(subsidy)}</strong>.</p>"
                f"<p><strong>1.3 Financial Feasibility & Debt Security:</strong><br>"
                f"Financial projections reflect strong operating cash flows with a 5-year average Debt Service Coverage Ratio (DSCR) of "
                f"<strong>{avg_dscr:.2f}</strong>, a low break-even operating threshold of <strong>{bep_percent:.1f}%</strong>, and a projected Internal Rate of Return (IRR) of "
                f"<strong>{corporate_project_irr:.1f}%</strong>. Debt servicing is fully secured via CGTMSE / Mudra credit guarantees.</p>"
            ),
            "business_overview": (
                f"<p><strong>2.1 Regulatory Compliance & Statutory Certifications:</strong><br>"
                f"{b_name} is registered as a {doc.entity_type} entity in {state}. The plant holds FSSAI Central Food Safety License ({doc.fssai_no or '11224999000999'}), "
                f"Udyam Registration ({doc.udyam_no or 'Registered'}), GSTIN ({doc.gst_no or 'Registered'}), and Trade License. All processing equipment utilizes SS304/SS316 food-grade contact surfaces in compliance with HACCP and ISO 22000 standards.</p>"
                f"<p><strong>2.2 Farmer Procurement Network & Social Governance:</strong><br>"
                f"The promoter management team maintains formal MoUs with regional FPOs and local farmer collectives across {district}. "
                f"This direct-from-farm model ensures guaranteed raw material availability at stable seasonal pricing while promoting sustainable organic farming practices.</p>"
            ),
            "project_background": (
                f"<p><strong>3.1 Market Opportunities in Agro-Processing:</strong><br>"
                f"India is the world's second-largest producer of agricultural commodities, yet post-harvest losses remain significant due to inadequate processing infrastructure. "
                f"The Ministry of Food Processing Industries (MoFPI) and Government of {state} offer dedicated capital subsidies (35% under PMFME / PMEGP) to establish modern rural food clusters.</p>"
                f"<p><strong>3.2 Consumer Shift Towards Organic Health Foods:</strong><br>"
                f"Rapid urbanization and growing health awareness have spurred consumer demand for unadulterated, preservative-free, chemical-free food products. "
                f"{b_name} capitalizes on this structural shift by offering 100% natural, nitrogen-flushed packaged food products with full farm-to-fork traceability.</p>"
            ),
            "product_description": (
                f"<p><strong>4.1 Commercial Product Portfolio & Standards:</strong><br>"
                f"The primary flagship product is <strong>{product}</strong> (HSN Code: <strong>{doc.hsn_code or '1102'}</strong>). "
                f"Products are processed without artificial colors or preservatives and packaged in high-barrier eco-friendly pouch packaging.</p>"
                f"<p><strong>4.2 Production Capacity & Operational Blueprint:</strong><br>"
                f"Installed processing capacity: <strong>{format_inr(doc.daily_capacity)} {doc.capacity_unit} per day</strong> over <strong>{doc.working_days} working days annually</strong>. "
                f"Key Competitive USP: {doc.usp or '100% organic cold-milled traditional processing with nitrogen flush freshness seal.'}</p>"
            ),
            "market_analysis": (
                f"<p><strong>5.1 Market Growth & Demographics:</strong><br>"
                f"The packaged organic food sector in India is expanding at <strong>{doc.market_growth:.1f}% CAGR</strong>. "
                f"Demand is sustained by growing urban household incomes, online grocery platforms, and institutional catering buyers.</p>"
                f"<p><strong>5.2 Retail & Institutional Distribution Strategy:</strong><br>"
                f"Target customers comprise {doc.target_customers or 'Retail supermarket chains, organic specialty stores, modern trade outlets, e-commerce platforms, and institutional bulk buyers'}. "
                f"Distribution covers primary regional commercial centers in {doc.sales_location or 'Karnataka, Tamil Nadu, Kerala, and Maharashtra'}."
                f"</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 Food Engineering & Sanitary Process Line:</strong><br>"
                f"The process flow incorporates automated grain/crop cleaning, destoning, cold-pulverizing/milling, magnetic metal separation, multi-head weighing, and automated nitrogen-flushed pouch sealing. "
                f"Equipment supplier: {doc.supplier_name or 'Certified Stainless Food Machinery OEM'}.</p>"
                f"<p><strong>6.2 Utilities & Clean Energy Operations:</strong><br>"
                f"•  <strong>Power:</strong> Sanctioned utility electric load of {doc.power_required or 25} HP/kW supported by rooftop solar PV and backup DG set.<br>"
                f"•  <strong>Water & Sanitation:</strong> RO water purification plant ({doc.water_required or 2000} LPD) with CIP (Clean-In-Place) sanitation protocols.<br>"
                f"•  <strong>Storage:</strong> Multi-commodity temperature-controlled cold room for perishable inventory preservation.</p>"
            ),
            "risk_analysis": (
                f"<p><strong>7.1 Agricultural Risk Management Framework:</strong><br>"
                f"•  <strong>Seasonal Supply Fluctuations:</strong> Mitigated through multi-district contract farming and multi-crop processing versatility.<br>"
                f"•  <strong>Perishability Risk:</strong> Mitigated via on-site cold room storage maintaining 4°C to 8°C temperature control.<br>"
                f"•  <strong>Food Safety & Quality Risk:</strong> Mitigated by operating an in-house micro-biology testing lab with strict batch-wise FSSAI sampling.</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 Strengths:</strong> {doc.strengths or 'Direct FPO farmer sourcing, modern SS304 food-grade machinery, FSSAI certification, cold storage backup.'}</p>"
                f"<p><strong>8.2 Weaknesses:</strong> {doc.weaknesses or 'Seasonal crop availability and initial retail distribution network buildup.'}</p>"
                f"<p><strong>8.3 Opportunities:</strong> {doc.opportunities or 'PMFME 35% government capital subsidy, rising e-commerce sales, organic export potential.'}</p>"
                f"<p><strong>8.4 Threats:</strong> {doc.threats or 'Unfavorable monsoon weather impacting crop yields and raw material price spikes.'}</p>"
            ),
            "conclusion": (
                f"<p><strong>9.1 Recommendation & Socio-Economic Impact:</strong><br>"
                f"The project of {b_name} generates high socio-economic value by establishing <strong>{doc.local_employment} direct local jobs</strong> "
                f"(including <strong>{doc.women_employment} women micro-entrepreneurs</strong>) and offering fair pricing to 200+ local farming families. "
                f"With strong cash flows, an average DSCR of <strong>{doc.avg_dscr:.2f}</strong>, and full credit guarantee coverage, the proposed bank loan request of "
                f"<strong>₹{format_inr(doc.bank_loan)}</strong> is strongly recommended for financial sanction.</p>"
            )
        }

    @staticmethod
    def _get_kannada_sections(doc: DPRDocumentModel, b_name, product, district, state, total_cost, land_cost, building_cost, electrification_cost, working_capital, promoter_contribution, bank_loan, subsidy, avg_dscr, bep_percent, corporate_project_irr, m_total) -> Dict[str, str]:
        return {
            "exec_summary": (
                f"<p><strong>1.1 ಕಾರ್ಯಾಂಗ ಅವಲೋಕನ ಮತ್ತು ಕೃಷಿ-ಕೈಗಾರಿಕಾ ಸಮರ್ಥನೆ:</strong><br>"
                f"{b_name} ಎಂಬುದು {district}, {state} ದಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ಸಮಗ್ರ ಕೃಷಿ-ಆಹಾರ ಸಂಸ್ಕರಣಾ ಘಟಕವಾಗಿದೆ. "
                f"ಈ ಘಟಕವು ಕಟ್ಟುನಿಟ್ಟಾದ FSSAI ಗ್ರೇಡ್ 1 ಆಹಾರ ಸುರಕ್ಷತಾ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಪ್ರೀಮಿಯಂ <strong>{product}</strong> "
                f"ನ ನೈರ್ಮಲ್ಯ ಸಂಸ್ಕರಣೆ, ಕೋಲ್ಡ್-ಮಿಲ್ಲಿಂಗ್ ಮತ್ತು ವ್ಯಾಕ್ಯೂಮ್ ಪ್ಯಾಕೇಜಿಂಗ್‌ಗೆ ಸಮರ್ಪಿತವಾಗಿದೆ. ಸ್ಥಳೀಯ ರೈತ ಉತ್ಪಾದಕ ಸಂಸ್ಥೆಗಳಿಂದ (FPO) ನೇರವಾಗಿ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸುವ ಮೂಲಕ "
                f"ಮಧ್ಯವರ್ತಿಗಳನ್ನು ನಿವಾರಿಸಿ ರೈತರಿಗೆ ಲಾಭದಾಯಕ ಬೆಲೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ.</p>"
                f"<p><strong>1.2 ಬಂಡವಾಳ ಹೂಡಿಕೆ ಮತ್ತು ವೆಚ್ಚ ಹಂಚಿಕೆ:</strong><br>"
                f"ಯೋಜನೆಯ ಒಟ್ಟು ಬಂಡವಾಳ ವೆಚ್ಚವು <strong>₹{format_inr(total_cost)}</strong> ಆಗಿದೆ. "
                f"ಇದು ಭೂಮಿ ನಿವೇಶನ ಸಿದ್ಧತೆ (₹{format_inr(land_cost)}), ನೈರ್ಮಲ್ಯ ಸಂಸ್ಕರಣಾ ಶೆಡ್ ನಿರ್ಮಾಣ (₹{format_inr(building_cost)}), "
                f"SS304 ಸ್ಟೇನ್‌ಲೆಸ್ ಸ್ಟೀಲ್ ಆಹಾರ ಯಂತ್ರೋಪಕರಣಗಳು (₹{format_inr(m_total)}), ಶೀತಲ ಸಂಗ್ರಹಾಗಾರ ಮೂಲಸೌಕರ್ಯ (₹{format_inr(electrification_cost)}), "
                f"ಮತ್ತು ಆರಂಭಿಕ ದುಡಿಯುವ ಬಂಡವಾಳ (₹{format_inr(working_capital)}) ಒಳಗೊಂಡಿದೆ. ಹಣಕಾಸು ರಚನೆಯು ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ ಬಂಡವಾಳ "
                f"<strong>₹{format_inr(promoter_contribution)}</strong>, ಬ್ಯಾಂಕ್ ಸಾಲ <strong>₹{format_inr(bank_loan)}</strong>, ಮತ್ತು PMFME ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ ಮೊತ್ತ <strong>₹{format_inr(subsidy)}</strong> ಒಳಗೊಂಡಿದೆ.</p>"
                f"<p><strong>1.3 ಹಣಕಾಸಿನ ಕಾರ್ಯಸಾಧ್ಯತೆ ಮತ್ತು ಸಾಲ ಸುರಕ್ಷತೆ:</strong><br>"
                f"ಹಣಕಾಸು ಮುನ್ನೋಟಗಳು ಬಲವಾದ ನಗದು ಹರಿವನ್ನು ದೃಢಪಡಿಸುತ್ತವೆ. ಯೋಜನೆಯು 5-ವರ್ಷಗಳ ಸರಾಸರಿ ಸಾಲ ಸೇವಾ ವ್ಯಾಪ್ತಿ ಅನುಪಾತ (DSCR) "
                f"<strong>{avg_dscr:.2f}</strong>, ಬ್ರೇಕ್-ಈವನ್ ಪಾಯಿಂಟ್ <strong>{bep_percent:.1f}%</strong>, ಮತ್ತು ಯೋಜನಾ IRR "
                f"<strong>{corporate_project_irr:.1f}%</strong> ಸಾಧಿಸುತ್ತದೆ. ಸಾಲ ಮರುಪಾವತಿಯು CGTMSE ಕ್ರೆಡಿಟ್ ಗ್ಯಾರಂಟಿ ಮೂಲಕ ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿದೆ.</p>"
            ),
            "business_overview": (
                f"<p><strong>2.1 ಶಾಸನಬದ್ಧ ಅನುಸರಣೆ ಮತ್ತು ಪ್ರಮಾಣೀಕರಣಗಳು:</strong><br>"
                f"{b_name} ಎಂಬುದು {state} ದಲ್ಲಿ ನೋಂದಾಯಿತ ಉದ್ಯಮವಾಗಿದ್ದು, FSSAI ಕೇಂದ್ರ ಆಹಾರ ಸುರಕ್ಷತಾ ಪರವಾನಗಿ ({doc.fssai_no or '11224999000999'}), "
                f"ಉದ್ಯಮ್ ನೋಂದಣಿ ({doc.udyam_no or 'ನೋಂದಾಯಿಸಲಾಗಿದೆ'}), ಜಿಎಸ್‌ಟಿ ({doc.gst_no or 'ಸಕ್ರಿಯ'}), ಮತ್ತು ವ್ಯಾಪಾರ ಪರವಾನಗಿ ಹೊಂದಿದೆ. ಎಲ್ಲಾ ಯಂತ್ರೋಪಕರಣಗಳು HACCP ಮತ್ತು ISO 22000 ಮಾನದಂಡಗಳ ಅಡಿಯಲ್ಲಿ SS304/SS316 ಆಹಾರ ದರ್ಜೆಯ ಸ್ಟೀಲ್‌ನಿಂದ ಕೂಡಿವೆ.</p>"
                f"<p><strong>2.2 ರೈತರ ಖರೀದಿ ಜಾಲ ಮತ್ತು ಪೂರೈಕೆ ಭದ್ರತೆ:</strong><br>"
                f"ಆಡಳಿತ ಮಂಡಳಿಯು {district} ಸುತ್ತಮುತ್ತಲಿನ ರೈತ ಉತ್ಪಾದಕ ಸಂಸ್ಥೆಗಳು (FPO) ಮತ್ತು ಸ್ಥಳೀಯ ರೈತ ಸಂಘಗಳೊಂದಿಗೆ ಅಧಿಕೃತ ಒಪ್ಪಂದಗಳನ್ನು ಹೊಂದಿದೆ. "
                f"ಈ ನೇರ ಕೃಷಿ ಮಾದರಿಯು ಸ್ಥಿರ ದರಗಳಲ್ಲಿ ಗುಣಮಟ್ಟದ ಕಚ್ಚಾ ವಸ್ತುಗಳ ಲಭ್ಯತೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.</p>"
            ),
            "project_background": (
                f"<p><strong>3.1 ಕೃಷಿ ಸಂಸ್ಕರಣಾ ವಲಯದಲ್ಲಿನ ಮಾರುಕಟ್ಟೆ ಅವಕಾಶಗಳು:</strong><br>"
                f"ಭಾರತವು ವಿಶ್ವದ ಅಗ್ರ ಕೃಷಿ ಉತ್ಪಾದಕ ರಾಷ್ಟ್ರವಾಗಿದ್ದರೂ, ಸಾಕಷ್ಟು ಸಂಸ್ಕರಣಾ ಸೌಲಭ್ಯಗಳ ಕೊರತೆಯಿಂದ ಕೊಯ್ಲಿನ ನಂತರದ ನಷ್ಟಗಳು ಹೆಚ್ಚಾಗಿವೆ. "
                f"ಕೇಂದ್ರ ಆಹಾರ ಸಂಸ್ಕರಣಾ ಸಚಿವಾಲಯ (MoFPI) ಮತ್ತು ಕರ್ನಾಟಕ ಸರ್ಕಾರವು PMFME / PMEGP ಅಡಿಯಲ್ಲಿ 35% ಬಂಡವಾಳ ಸಬ್ಸಿಡಿಯನ್ನು ಒದಗಿಸುತ್ತಿದೆ.</p>"
                f"<p><strong>3.2 ನೈಸರ್ಗಿಕ ಮತ್ತು ಸಾವಯವ ಆಹಾರದ ಬೇಡಿಕೆ:</strong><br>"
                f"ಆರೋಗ್ಯ ಜಾಗೃತಿ ಮತ್ತು ನೈಸರ್ಗಿಕ ಆಹಾರಗಳ ಬೇಡಿಕೆ ಗ್ರಾಹಕರಲ್ಲಿ ಹೆಚ್ಚುತ್ತಿದೆ. "
                f"{b_name} ಕೃತಕ ಬಣ್ಣ ಮತ್ತು ಸಂರಕ್ಷಕಗಳಿಲ್ಲದ ಶುದ್ಧ ಪ್ಯಾಕೇಜ್ಡ್ ಆಹಾರ ಉತ್ಪನ್ನಗಳನ್ನು ಪೂರೈಸುತ್ತದೆ.</p>"
            ),
            "product_description": (
                f"<p><strong>4.1 ವಾಣಿಜ್ಯ ಉತ್ಪನ್ನ ಪೋರ್ಟ್‌ಫೋಲಿಯೊ ಮತ್ತು ಮಾನದಂಡಗಳು:</strong><br>"
                f"ಮುಖ್ಯ ಉತ್ಪನ್ನವು <strong>{product}</strong> (HSN ಕೋಡ್: <strong>{doc.hsn_code or '1102'}</strong>) ಆಗಿದೆ. "
                f"ಪರಿಸರಸ್ನೇಹಿ ಉನ್ನತ ತಡೆಗೋಡೆ ಪೌಚ್‌ಗಳಲ್ಲಿ ನೈಟ್ರೋಜನ್ ಫ್ಲಶ್‌ನೊಂದಿಗೆ ಪ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತದೆ.</p>"
                f"<p><strong>4.2 ಉತ್ಪಾದನಾ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಕಾರ್ಯಾಚರಣೆ:</strong><br>"
                f"ಸ್ಥಾಪಿತ ಸಂಸ್ಕರಣಾ ಸಾಮರ್ಥ್ಯ: <strong>ದಿನಕ್ಕೆ {format_inr(doc.daily_capacity)} {doc.capacity_unit}</strong>, ವರ್ಷಕ್ಕೆ <strong>{doc.working_days} ಕೆಲಸದ ದಿನಗಳು</strong>. "
                f"ಪ್ರಮುಖ ಯುಎಸ್‌ಪಿ: {doc.usp or '100% ಶುದ್ಧ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಸ್ಕರಣೆ ಮತ್ತು ತಾಜಾತನ ರಕ್ಷಣೆ.'}</p>"
            ),
            "market_analysis": (
                f"<p><strong>5.1 ಮಾರುಕಟ್ಟೆ ಬೆಳವಣಿಗೆ ಮತ್ತು ಜನಸಂಖ್ಯಾ ಪ್ರವೃತ್ತಿ:</strong><br>"
                f"ಭಾರತದಲ್ಲಿ ಪ್ಯಾಕೇಜ್ಡ್ ಆಹಾರ ಕ್ಷೇತ್ರವು ವಾರ್ಷಿಕ <strong>{doc.market_growth:.1f}% CAGR</strong> ದರದಲ್ಲಿ ಬೆಳೆಯುತ್ತಿದೆ. "
                f"ಸೂಪರ್‌ಮಾರ್ಕೆಟ್‌ಗಳು ಮತ್ತು ಆನ್‌ಲೈನ್ ಪೋರ್ಟಲ್‌ಗಳ ಮೂಲಕ ನಿರಂತರ ಬೇಡಿಕೆ ಇರುತ್ತದೆ.</p>"
                f"<p><strong>5.2 ಚಿಲ್ಲರೆ ಮತ್ತು ಸಾಂಸ್ಥಿಕ ವಿತರಣಾ ತಂತ್ರ:</strong><br>"
                f"ಗುರಿ ಗ್ರಾಹಕರು: {doc.target_customers or 'ಸೂಪರ್‌ಮಾರ್ಕೆಟ್ ಸರಪಳಿಗಳು, ಸಾವಯವ ವಿಶೇಷ ಮಳಿಗೆಗಳು, ಇ-ಕಾಮರ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗಳು ಮತ್ತು ಸಾಂಸ್ಥಿಕ ಖರೀದಿದಾರರು'}. "
                f"ಮಾರಾಟ ವ್ಯಾಪ್ತಿ: {doc.sales_location or 'ಕರ್ನಾಟಕ, ತಮಿಳುನಾಡು, ಕೇರಳ ಮತ್ತು ಪ್ರಮುಖ ದಕ್ಷಿಣ ಭಾರತದ ನಗರಗಳು'}."
                f"</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 ಆಹಾರ ಎಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ನೈರ್ಮಲ್ಯ ಸಂಸ್ಕರಣಾ ಮಾರ್ಗ:</strong><br>"
                f"ಪ್ರಕ್ರಿಯೆಯು ಧಾನ್ಯ ಶುಚಿಗೊಳಿಸುವಿಕೆ, ಡಿ-ಸ್ಟೋನಿಂಗ್, ಕೋಲ್ಡ್ ಪಲ್ವರೈಸಿಂಗ್, ಮ್ಯಾಗ್ನೆಟಿಕ್ ಮೆಟಲ್ ಬೇರ್ಪಡಿಕೆ ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ಪೌಚ್ ಸೀಲಿಂಗ್ ಒಳಗೊಂಡಿದೆ. "
                f"ಉಪಕರಣ ಪೂರೈಕೆದಾರರು: {doc.supplier_name or 'ಪ್ರಮಾಣೀಕೃತ ಸ್ಟೇನ್‌ಲೆಸ್ ಫುಡ್ ಮೆಷಿನರಿ ತಯಾರಕರು'}.</p>"
                f"<p><strong>6.2 ಯುಟಿಲಿಟಿಗಳು ಮತ್ತು ಪರಿಸರ ಸಂರಕ್ಷಣೆ:</strong><br>"
                f"•  <strong>ವಿದ್ಯುತ್:</strong> ಮಂಜೂರಾದ ವಾಣಿಜ್ಯ ವಿದ್ಯುತ್ ಲೋಡ್ {doc.power_required or 25} HP/kW ಮತ್ತು 100% DG ಬ್ಯಾಕಪ್.<br>"
                f"•  <strong>ನೀರು ಮತ್ತು ನೈರ್ಮಲ್ಯ:</strong> CIP ಪ್ರೋಟೋಕಾಲ್‌ಗಳೊಂದಿಗೆ RO ನೀರು ಶುದ್ಧೀಕರಣ ಘಟಕ ({doc.water_required or 2000} LPD).<br>"
                f"•  <strong>ಶೀತಲ ಶೇಖರಣೆ:</strong> ಹಾಳಾಗುವ ವಸ್ತುಗಳ ರಕ್ಷಣೆಗಾಗಿ ತಾಪಮಾನ ನಿಯಂತ್ರಿತ ಕೋಲ್ಡ್ ರೂಮ್.</p>"
            ),
            "risk_analysis": (
                f"<p><strong>7.1 ಕೃಷಿ ಅಪಾಯ ನಿರ್ವಹಣಾ ಚೌಕಟ್ಟು:</strong><br>"
                f"•  <strong>ಕಾಲೋಚಿತ ಪೂರೈಕೆ ಏರಿಳಿತ:</strong> ಬಹು-ಜಿಲ್ಲಾ ಗುತ್ತಿಗೆ ಕೃಷಿ ಮತ್ತು ಬಹು-ಬೆಳೆ ಸಂಸ್ಕರಣೆಯಿಂದ ನಿವಾರಿಸಲಾಗುತ್ತದೆ.<br>"
                f"•  <strong>ಹಾಳಾಗುವ ಅಪಾಯ:</strong> 4°C ನಿಂದ 8°C ತಾಪಮಾನ ನಿಯಂತ್ರಣ ಹೊಂದಿರುವ ಕೋಲ್ಡ್ ರೂಮ್ ಮೂಲಕ ರಕ್ಷಣೆ.<br>"
                f"•  <strong>ಗುಣಮಟ್ಟದ ಅಪಾಯ:</strong> ಆಂತರಿಕ ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯ ಮತ್ತು ಕಟ್ಟುನಿಟ್ಟಾದ FSSAI ಮಾದರಿ ಪರೀಕ್ಷೆ.</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 ಸಾಮರ್ಥ್ಯಗಳು:</strong> {doc.strengths or 'ನೇರ ರೈತರ ಸಂಪರ್ಕ, ಆಧುನಿಕ SS304 ಫುಡ್-ಗ್ರೇಡ್ ಯಂತ್ರಗಳು, FSSAI ಪ್ರಮಾಣೀಕರಣ, ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಬ್ಯಾಕಪ್.'}</p>"
                f"<p><strong>8.2 ದೌರ್ಬಲ್ಯಗಳು:</strong> {doc.weaknesses or 'ಕಾಲೋಚಿತ ಬೆಳೆ ಲಭ್ಯತೆ ಮತ್ತು ಆರಂಭಿಕ ಚಿಲ್ಲರೆ ವಿತರಣಾ ಜಾಲ ವಿಸ್ತರಣೆ.'}</p>"
                f"<p><strong>8.3 ಅವಕಾಶಗಳು:</strong> {doc.opportunities or 'PMFME 35% ಸರ್ಕಾರಿ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ, ಇ-ಕಾಮರ್ಸ್ ಮಾರಾಟ ವಿಸ್ತರಣೆ, ಸಾವಯವ ರಫ್ತು ಸಾಮರ್ಥ್ಯ.'}</p>"
                f"<p><strong>8.4 ಸವಾಲುಗಳು:</strong> {doc.threats or 'ಅಕಾಲಿಕ ಹವಾಮಾನ ಬದಲಾವಣೆ ಮತ್ತು ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬೆಲೆ ಏರಿಳಿತ.'}</p>"
            ),
            "conclusion": (
                f"<p><strong>9.1 ಶಿಫಾರಸು ಮತ್ತು ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಪರಿಣಾಮ:</strong><br>"
                f"{b_name} ಯೋಜನೆಯು <strong>{doc.local_employment} ಸ್ಥಳೀಯ ನೇರ ಉದ್ಯೋಗಗಳನ್ನು</strong> "
                f"(ಇದರಲ್ಲಿ <strong>{doc.women_employment} ಮಹಿಳಾ ಉದ್ಯೋಗಿಗಳು</strong> ಸೇರಿದ್ದಾರೆ) ಸೃಷ್ಟಿಸುತ್ತದೆ ಮತ್ತು 200 ಕ್ಕೂ ಹೆಚ್ಚು ಸ್ಥಳೀಯ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ನ್ಯಾಯಯುತ ಬೆಲೆ ಒದಗಿಸುತ್ತದೆ. "
                f"ಬಲವಾದ ನಗದು ಹರಿವು, ಸರಾಸರಿ DSCR <strong>{doc.avg_dscr:.2f}</strong> ನೊಂದಿಗೆ ಬ್ಯಾಂಕ್ ಸಾಲ ಮೊತ್ತ "
                f"<strong>₹{format_inr(doc.bank_loan)}</strong> ಅನ್ನು ತಕ್ಷಣದ ಆರ್ಥಿಕ ಮಂಜೂರಾತಿಗಾಗಿ ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.</p>"
            )
        }

    @staticmethod
    def _get_hindi_sections(doc: DPRDocumentModel, b_name, product, district, state, total_cost, land_cost, building_cost, electrification_cost, working_capital, promoter_contribution, bank_loan, subsidy, avg_dscr, bep_percent, corporate_project_irr, m_total) -> Dict[str, str]:
        return {
            "exec_summary": (
                f"<p><strong>1.1 कार्यकारी सारांश एवं कृषि-औद्योगिक औचित्य:</strong><br>"
                f"{b_name} {district}, {state} में स्थापित एक एकीकृत कृषि-खाद्य प्रसंस्करण इकाई है। "
                f"यह इकाई सख्त FSSAI ग्रेड 1 खाद्य सुरक्षा मानकों के अनुसार प्रीमियम <strong>{product}</strong> "
                f"के स्वच्छ प्रसंस्करण, कोल्ड-मिलिंग एवं वैक्यूम पैकेजिंग के लिए समर्पित है। यह परियोजना स्थानीय किसान उत्पादक संगठनों (FPO) से सीधे कृषि उपज खरीदकर मध्यस्थों को समाप्त करती है और किसानों को लाभकारी मूल्य प्रदान करती है।</p>"
                f"<p><strong>1.2 पूंजीगत व्यय एवं आवंटन:</strong><br>"
                f"परियोजना का कुल पूंजीगत परिव्यय <strong>₹{format_inr(total_cost)}</strong> है। "
                f"इसमें भूमि विकास (₹{format_inr(land_cost)}), स्वच्छ प्रसंस्करण शेड निर्माण (₹{format_inr(building_cost)}), "
                f"SS304 खाद्य ग्रेड मशीनरी (₹{format_inr(m_total)}), कोल्ड स्टोरेज अवसंरचना (₹{format_inr(electrification_cost)}), "
                f"और प्रारंभिक कार्यशील पूंजी (₹{format_inr(working_capital)}) शामिल है। वित्तपोषण संरचना में प्रवर्तक इक्विटी "
                f"<strong>₹{format_inr(promoter_contribution)}</strong>, बैंक सावधि ऋण <strong>₹{format_inr(bank_loan)}</strong>, और PMFME पूंजीगत सब्सिडी दावा <strong>₹{format_inr(subsidy)}</strong> शामिल है।</p>"
                f"<p><strong>1.3 वित्तीय साध्यता एवं ऋण सुरक्षा:</strong><br>"
                f"वित्तीय अनुमान मजबूत परिचालन नकदी प्रवाह दर्शाते हैं, जिसमें 5-वर्षीय औसत ऋण सेवा कवरेज अनुपात (DSCR) "
                f"<strong>{avg_dscr:.2f}</strong>, ब्रेक-ईवन पॉइंट <strong>{bep_percent:.1f}%</strong>, और अनुमानित आंतरिक प्रतिफल दर (IRR) "
                f"<strong>{corporate_project_irr:.1f}%</strong> है। ऋण अदायगी CGTMSE क्रेडिट गारंटी द्वारा पूरी तरह सुरक्षित है।</p>"
            ),
            "business_overview": (
                f"<p><strong>2.1 वैधानिक अनुपालन एवं प्रमाणन:</strong><br>"
                f"{b_name} {state} में पंजीकृत उद्यम है, जिसके पास FSSAI केंद्रीय खाद्य सुरक्षा लाइसेंस ({doc.fssai_no or '11224999000999'}), "
                f"उद्यम पंजीकरण ({doc.udyam_no or 'पंजीकृत'}), जीएसटी ({doc.gst_no or 'सक्रिय'}), और ट्रेड लाइसेंस है। सभी मशीनरी HACCP और ISO 22000 मानकों के तहत SS304/SS316 फूड-ग्रेड स्टील से निर्मित हैं।</p>"
                f"<p><strong>2.2 किसान खरीद नेटवर्क एवं आपूर्ति सुरक्षा:</strong><br>"
                f"प्रबंधन का {district} के आसपास के किसान उत्पादक संगठनों (FPO) और स्थानीय किसान समूहों के साथ सीधा समझौता है, जिससे स्थिर दरों पर गुणवत्तापूर्ण कच्चे माल की आपूर्ति सुनिश्चित होती है।</p>"
            ),
            "project_background": (
                f"<p><strong>3.1 कृषि प्रसंस्करण क्षेत्र में बाजार अवसर:</strong><br>"
                f"भारत दुनिया का प्रमुख कृषि उत्पादक देश होने के बावजूद प्रसंस्करण सुविधाओं की कमी से जूझ रहा है। केंद्र सरकार के खाद्य प्रसंस्करण उद्योग मंत्रालय (MoFPI) और राज्य सरकार द्वारा PMFME योजना के तहत 35% पूंजीगत सब्सिडी प्रदान की जा रही है।</p>"
                f"<p><strong>3.2 प्राकृतिक एवं जैविक खाद्य उत्पादों की मांग:</strong><br>"
                f"उपभोक्ताओं में स्वास्थ्य जागरूकता और प्राकृतिक खाद्य पदार्थों की मांग तेजी से बढ़ रही है। {b_name} बिना किसी कृत्रिम रंग या परिरक्षक के शुद्ध पैकेज्ड उत्पाद प्रदान करता है।</p>"
            ),
            "product_description": (
                f"<p><strong>4.1 वाणिज्यिक उत्पाद पोर्टफोलियो एवं मानक:</strong><br>"
                f"मुख्य उत्पाद <strong>{product}</strong> (HSN कोड: <strong>{doc.hsn_code or '1102'}</strong>) है। पर्यावरण के अनुकूल उच्च-अवरोधक पाउच में नाइट्रोजन फ्लशिंग के साथ पैक किया जाता है।</p>"
                f"<p><strong>4.2 उत्पादन क्षमता एवं परिचालन:</strong><br>"
                f"स्थापित प्रसंस्करण क्षमता: <strong>{format_inr(doc.daily_capacity)} {doc.capacity_unit} प्रति दिन</strong>, वर्ष में <strong>{doc.working_days} कार्य दिवस</strong>। मुख्य यूएसपी: {doc.usp or '100% शुद्ध पारंपरिक प्रसंस्करण एवं पोषण संरक्षण।'}</p>"
            ),
            "market_analysis": (
                f"<p><strong>5.1 बाजार वृद्धि एवं जनसांख्यिकीय रुझान:</strong><br>"
                f"भारत में पैकेज्ड खाद्य क्षेत्र <strong>{doc.market_growth:.1f}% CAGR</strong> की दर से बढ़ रहा है। सुपरमार्केट और ऑनलाइन प्लेटफॉर्म के माध्यम से निरंतर मांग बनी रहती है।</p>"
                f"<p><strong>5.2 खुदरा एवं संस्थागत वितरण रणनीति:</strong><br>"
                f"लक्षित ग्राहक: {doc.target_customers or 'सुपरमार्केट श्रृंखलाएं, जैविक विशेषता स्टोर, ई-कॉमर्स प्लेटफॉर्म एवं संस्थागत खरीदार'}। बिक्री क्षेत्र: {doc.sales_location or 'राज्य के प्रमुख औद्योगिक एवं शहरी केंद्र'}।</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 खाद्य इंजीनियरिंग एवं स्वच्छ प्रसंस्करण लाइन:</strong><br>"
                f"प्रक्रिया में अनाज सफाई, डी-स्टोनिंग, कोल्ड पल्वराइजिंग, चुंबकीय धातु पृथक्करण और स्वचालित पाउच सीलिंग शामिल है। उपकरण आपूर्तिकर्ता: {doc.supplier_name or 'प्रमाणित स्टेनलेस फूड मशीनरी निर्माता'}।</p>"
                f"<p><strong>6.2 उपयोगिताएं एवं पर्यावरण संरक्षण:</strong><br>"
                f"• <strong>विद्युत:</strong> स्वीकृत वाणिज्यिक विद्युत भार {doc.power_required or 25} HP/kW और 100% DG बैकअप।<br>"
                f"• <strong>जल एवं स्वच्छता:</strong> CIP प्रोटोकॉल के साथ RO जल शोधन संयंत्र ({doc.water_required or 2000} LPD)।<br>"
                f"• <strong>कोल्ड स्टोरेज:</strong> तापमान नियंत्रित कोल्ड रूम।</p>"
            ),
            "risk_analysis": (
                f"<p><strong>7.1 कृषि जोखिम प्रबंधन ढांचा:</strong><br>"
                f"• <strong>मौसमी आपूर्ति उतार-चढ़ाव:</strong> बहु-जिला अनुबंध खेती और बहु-फसल प्रसंस्करण द्वारा कम किया गया।<br>"
                f"• <strong>खराब होने का जोखिम:</strong> 4°C से 8°C तापमान नियंत्रित कोल्ड स्टोरेज द्वारा संरक्षण।<br>"
                f"• <strong>गुणवत्ता जोखिम:</strong> इन-हाउस परीक्षण प्रयोगशाला और सख्त FSSAI नमूना परीक्षण।</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 ताकत:</strong> {doc.strengths or 'सीधा किसान संपर्क, आधुनिक SS304 फूड-ग्रेड मशीनरी, FSSAI प्रमाणन, कोल्ड स्टोरेज बैकअप।'}</p>"
                f"<p><strong>8.2 कमजोरियां:</strong> {doc.weaknesses or 'मौसमी फसल उपलब्धता और प्रारंभिक खुदरा नेटवर्क विस्तार।'}</p>"
                f"<p><strong>8.3 अवसर:</strong> {doc.opportunities or 'PMFME 35% सरकारी पूंजीगत सब्सिडी, ई-कॉमर्स बिक्री विस्तार, जैविक निर्यात क्षमता।'}</p>"
                f"<p><strong>8.4 चुनौतियां:</strong> {doc.threats or 'अनियमित मौसम परिवर्तन और कच्चे माल की कीमतों में उतार-चढ़ाव।'}</p>"
            ),
            "conclusion": (
                f"<p><strong>9.1 अनुशंसा एवं सामाजिक-आर्थिक प्रभाव:</strong><br>"
                f"{b_name} परियोजना <strong>{doc.local_employment} स्थानीय प्रत्यक्ष रोजगार</strong> (जिसमें <strong>{doc.women_employment} महिला कर्मचारी</strong> शामिल हैं) उत्पन्न करती है और 200 से अधिक स्थानीय किसान परिवारों को लाभकारी मूल्य प्रदान करती है। "
                f"मजबूत नकदी प्रवाह, औसत DSCR <strong>{doc.avg_dscr:.2f}</strong> के साथ बैंक ऋण राशि <strong>₹{format_inr(doc.bank_loan)}</strong> को तत्काल वित्तीय स्वीकृति हेतु दृढ़ता से अनुशंसित किया जाता है।</p>"
            )
        }
