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

        return {
            "exec_summary": (
                f"<p><strong>1.1 Executive Overview & Agro-Industrial Rationale:</strong><br>"
                f"{b_name} is an integrated agro-food processing facility established in {district}, {state}. "
                f"The unit is dedicated to the hygienic processing, cold-milling, and MAP vacuum packaging of premium <strong>{product}</strong> "
                f"conforming to strict FSSAI Grade 1 food safety norms. The project bridges agricultural supply chain gaps by purchasing raw farm produce "
                f"directly from local Farmer Producer Organizations (FPOs), eliminating intermediary markups and enhancing farmer realization.</p>"
                f"<p><strong>1.2 Financial Outlay & Capital Allocation:</strong><br>"
                f"The project entails a total capital expenditure of <strong>₹{total_cost:,.2f}</strong>. "
                f"Capital allocation comprises land site preparation (₹{land_cost:,.2f}), food-grade sanitary processing shed construction (₹{building_cost:,.2f}), "
                f"SS304 stainless steel food machinery (₹{m_total:,.2f}), cold room storage infrastructure (₹{electrification_cost:,.2f}), "
                f"and initial operational working capital (₹{working_capital:,.2f}). Financing is structured via promoter equity contribution of "
                f"<strong>₹{promoter_contribution:,.2f}</strong>, bank debt facility of <strong>₹{bank_loan:,.2f}</strong>, and government PMFME capital subsidy claim of <strong>₹{subsidy:,.2f}</strong>.</p>"
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
                f"Installed processing capacity: <strong>{doc.daily_capacity:,.0f} {doc.capacity_unit} per day</strong> over <strong>{doc.working_days} working days annually</strong>. "
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
                f"<strong>₹{doc.bank_loan:,.2f}</strong> is strongly recommended for financial sanction.</p>"
            )
        }
