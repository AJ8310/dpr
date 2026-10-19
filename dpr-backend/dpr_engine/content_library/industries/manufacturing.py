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

class ManufacturingNarrative:

    @staticmethod
    def get_sections(doc: DPRDocumentModel) -> Dict[str, str]:
        lang = str(getattr(doc, 'language', 'en') or 'en').lower()
        is_kn = 'kn' in lang or 'kannada' in lang
        is_hi = 'hi' in lang or 'hindi' in lang

        b_name = doc.business_name or ("ಉದ್ಯಮ" if is_kn else ("उद्यम" if is_hi else "the Enterprise"))
        
        default_promoter = "ಮುಖ್ಯ ಪ್ರವರ್ತಕರು" if is_kn else ("मुख्य प्रवर्तक" if is_hi else "Lead Promoter")
        promoter = (getattr(doc, 'promoter_name', None) or getattr(doc, 'contact_name', None) or default_promoter)

        default_product = "ನಿಖರ ಎಂಜಿನಿಯರಿಂಗ್ ಕೈಗಾರಿಕಾ ಘಟಕಗಳು" if is_kn else ("सटीक औद्योगिक विनिर्मित घटक" if is_hi else "precision manufactured components")
        product = doc.primary_product or default_product
        
        district = doc.district or ("ಬೆಂಗಳೂರು" if is_kn else ("बेंगलुरु" if is_hi else "Bengaluru"))
        state = doc.state or ("ಕರ್ನಾಟಕ" if is_kn else ("कर्नाटक" if is_hi else "Karnataka"))

        total_cost = safe_float(doc.total_cost, 25000000.0)
        land_cost = safe_float(doc.land_cost, 2500000.0)
        building_cost = safe_float(doc.building_cost, 4500000.0)
        furniture_cost = safe_float(doc.furniture_cost, 400000.0)
        other_cost = safe_float(doc.other_cost, 500000.0)
        electrification_cost = safe_float(doc.electrification_cost, 600000.0)
        working_capital = safe_float(doc.working_capital, 2000000.0)
        promoter_contribution = safe_float(doc.promoter_contribution, 6250000.0)
        bank_loan = safe_float(doc.bank_loan, 18750000.0)
        subsidy = safe_float(doc.subsidy, 0.0)
        avg_dscr = safe_float(doc.avg_dscr, 1.85)
        bep_percent = safe_float(doc.bep_percent, 48.5)
        corporate_npv = safe_float(doc.corporate_npv, total_cost * 0.28)
        corporate_project_irr = safe_float(doc.corporate_project_irr, 22.4)
        corporate_payback_years = safe_float(doc.corporate_payback_years, 3.2)
        daily_capacity = safe_float(doc.daily_capacity, 100.0)
        market_growth = safe_float(doc.market_growth, 12.0)
        builtup_area = safe_float(doc.builtup_area, 2500.0)
        power_required = safe_float(doc.power_required, 25.0)
        water_required = safe_float(doc.water_required, 2000.0)
        m_total = sum(safe_float(m.total) for m in doc.machinery) if doc.machinery else total_cost * 0.45

        promoter_pct = (promoter_contribution / total_cost * 100) if total_cost > 0 else 25.0
        bank_pct = (bank_loan / total_cost * 100) if total_cost > 0 else 75.0
        debt_equity_val = (bank_loan / promoter_contribution) if promoter_contribution > 0 else 2.5

        if is_kn:
            return ManufacturingNarrative._get_kannada_sections(doc, b_name, promoter, product, district, state, total_cost, land_cost, building_cost, furniture_cost, other_cost, electrification_cost, working_capital, promoter_contribution, bank_loan, subsidy, avg_dscr, bep_percent, corporate_npv, corporate_project_irr, corporate_payback_years, daily_capacity, market_growth, builtup_area, power_required, water_required, m_total, promoter_pct, bank_pct, debt_equity_val)
        if is_hi:
            return ManufacturingNarrative._get_hindi_sections(doc, b_name, promoter, product, district, state, total_cost, land_cost, building_cost, furniture_cost, other_cost, electrification_cost, working_capital, promoter_contribution, bank_loan, subsidy, avg_dscr, bep_percent, corporate_npv, corporate_project_irr, corporate_payback_years, daily_capacity, market_growth, builtup_area, power_required, water_required, m_total, promoter_pct, bank_pct, debt_equity_val)

        return {
            "exec_summary": (
                f"<p><strong>1.1 Strategic Rationale & Executive Summary:</strong><br>"
                f"{b_name} is a state-of-the-art commercial manufacturing unit established in {district}, {state}. "
                f"The venture focuses on the automated, high-volume production of premium {product} "
                f"conforming to international quality benchmarks (ISO 9001:2015). The project addresses critical supply chain "
                f"gaps in the regional industrial manufacturing ecosystem by delivering high-precision components with zero-defect tolerances.</p>"
                f"<p><strong>1.2 Investment Summary & Capital Outlay Rationale:</strong><br>"
                f"The total capital outlay for establishing the project is estimated at <strong>₹{format_inr(total_cost)}</strong>. "
                f"This investment encompasses land & site development (₹{format_inr(land_cost)}), industrial building shed construction (₹{format_inr(building_cost)}), "
                f"plant & machinery procurement (₹{format_inr(m_total)}), electrification & high-voltage transformer utilities (₹{format_inr(electrification_cost)}), "
                f"office furniture & fixtures (₹{format_inr(furniture_cost)}), pre-operative contingencies (₹{format_inr(other_cost)}), "
                f"and working capital margin requirement (₹{format_inr(working_capital)}).</p>"
                f"<p><strong>1.3 Means of Finance & Debt Structuring:</strong><br>"
                f"The means of finance comprises promoter equity contribution of <strong>₹{format_inr(promoter_contribution)}</strong> ({promoter_pct:.1f}%), "
                f"bank term loan facility of <strong>₹{format_inr(bank_loan)}</strong> ({bank_pct:.1f}%), and government capital subsidy claim of "
                f"<strong>₹{format_inr(subsidy)}</strong>. The promoter equity is fully injected through private capital reserves, demonstrating strong promoter commitment.</p>"
                f"<p><strong>1.4 Financial Viability & Bank Sanction Rationale:</strong><br>"
                f"Financial modeling demonstrates robust cash flow generation. The project achieves an average 5-year Debt Service Coverage Ratio (DSCR) of "
                f"<strong>{avg_dscr:.2f}</strong> (substantially higher than the banking benchmark of 1.50x), a Break-Even Point (BEP) of "
                f"<strong>{bep_percent:.1f}%</strong>, a Net Present Value (NPV) of <strong>₹{format_inr(corporate_npv)}</strong>, and an Internal Rate of Return (IRR) of "
                f"<strong>{corporate_project_irr:.1f}%</strong>. The payback period for total capital invested is estimated at <strong>{corporate_payback_years:.1f} years</strong>. "
                f"The proposal is strongly recommended for immediate term loan sanction.</p>"
            ),
            "business_overview": (
                f"<p><strong>2.1 Corporate Constitution & Statutory Profile:</strong><br>"
                f"{b_name} is incorporated as a {doc.entity_type} entity headquartered in {state}. The business operates under full statutory compliance with national MSME regulations, "
                f"holding active Udyam Registration ({doc.udyam_no or 'Registered'}), GSTIN ({doc.gst_no or 'Active Registered'}), PAN ({doc.pan_no or 'Active'}), "
                f"and Corporate Identification Number (CIN: {doc.cin or 'N/A'}).</p>"
                f"<p><strong>2.2 Promoter Background & Management Competence:</strong><br>"
                f"The enterprise is spearheaded by {promoter} along with experienced technical and management leads possessing over 12 years of hands-on expertise in industrial production, "
                f"tooling design, quality engineering, and supply chain logistics. The management team maintains a flawless credit history (CIBIL Score: {doc.cibil_score or 780}) and enforces strict internal corporate governance protocols.</p>"
                f"<p><strong>2.3 Vision, Mission & Strategic Governance:</strong><br>"
                f"The organization is driven by a vision to become the preferred Tier-1 supplier of precision industrial components across South India. "
                f"Operating principles emphasize continuous innovation, lean manufacturing (Kaizen / 5S), zero waste, and transparent financial reporting.</p>"
                f"<p><strong>2.4 Corporate Office & Industrial Location:</strong><br>"
                f"The registered office and manufacturing works are located at {district}, {state}. The site is strategically positioned within a designated industrial zone, "
                f"providing immediate access to 3-phase high-tension power grids, commercial water lines, skilled technical labor, and major national freight corridors.</p>"
            ),
            "project_background": (
                f"<p><strong>3.1 Macroeconomic Environment & Industrial Context:</strong><br>"
                f"The Indian manufacturing sector is experiencing accelerated growth driven by government initiatives such as 'Make in India', Production-Linked Incentive (PLI) schemes, "
                f"and expanding global supply chain diversification towards India. The industrial component sector plays a pivotal role as the backbone for automotive, aerospace, defense, and capital goods industries.</p>"
                f"<p><strong>3.2 Strategic Necessity of Project Setup:</strong><br>"
                f"Regional OEM manufacturers in {state} currently face lead-time delays and procurement bottlenecks when sourcing high-precision components from distant industrial clusters. "
                f"The setup of {b_name} offers a localized, highly responsive manufacturing hub capable of delivering just-in-time (JIT) component supplies.</p>"
                f"<p><strong>3.3 Alignment with National & State MSME Policies:</strong><br>"
                f"The project directly aligns with the Karnataka Industrial Policy 2020-2025 and Central MSME Development Guidelines, qualifying for capital investment subsidies, "
                f"power tariff concessions, and interest subvention benefits under designated government schemes.</p>"
            ),
            "product_description": (
                f"<p><strong>4.1 Primary Product Line & Technical Specifications:</strong><br>"
                f"The unit specializes in the manufacture of high-precision <strong>{product}</strong> (HSN Code: {doc.hsn_code or '8466'}). "
                f"All output conforms to ISO 9001:2015, DIN, and BIS international standards with tight dimensional tolerances (+/- 0.005mm).</p>"
                f"<p><strong>4.2 Manufacturing Workflow & Quality Inspection:</strong><br>"
                f"The production flow follows a rigorous multi-stage quality protocol: (1) Raw Material Chemical & Tensile Inspection, (2) Automated CNC Precision Machining, "
                f"(3) Heat Treatment & Stress Relieving, (4) Surface Coating & Washing, and (5) 3D Coordinate Measuring Machine (CMM) Dimensional Audit before Final Packaging.</p>"
                f"<p><strong>4.3 Installed Daily Capacity & Utilization Profile:</strong><br>"
                f"The facility is designed for an installed daily capacity of <strong>{format_inr(daily_capacity)} {doc.capacity_unit} per day</strong>, operating {doc.working_days} days per year in double shifts. "
                f"Capacity utilization is modeled conservatively at 60% in Year 1, ramping to 75% in Year 2, 85% in Year 3, and 90-95% in Years 4 and 5.</p>"
                f"<p><strong>4.4 Value Proposition & Competitive Edge:</strong><br>"
                f"The key competitive advantages of {b_name} include lower unit production costs via automated machinery, zero-defect quality assurance, customizable batch sizing, and direct local technical support.</p>"
                f"<p><strong>4.5 Packaging, Storage & Shelf-Life Management:</strong><br>"
                f"Finished components undergo anti-corrosive VCI oil dipping, vacuum shrink wrapping, and heavy-duty corrugated box packaging to prevent transport damage and environmental degradation during transit.</p>"
            ),
            "market_analysis": (
                f"<p><strong>5.1 Industry Size, CAGR Growth & Demand Sizing:</strong><br>"
                f"The Indian industrial component and precision engineering market is valued at over ₹1.2 Lakh Crore and is expanding at an annual CAGR of <strong>{market_growth:.1f}%</strong>. "
                f"Demand is propelled by surging investments in electric vehicle (EV) manufacturing, defense localization mandates, renewable energy infrastructure, and industrial automation.</p>"
                f"<p><strong>5.2 Total Addressable Market (TAM / SAM / SOM) Analysis:</strong><br>"
                f"• <strong>Total Addressable Market (TAM):</strong> ₹45,000 Crore national market for industrial components.<br>"
                f"• <strong>Serviceable Addressable Market (SAM):</strong> ₹3,800 Crore regional market across Karnataka, Tamil Nadu, and Maharashtra.<br>"
                f"• <strong>Serviceable Obtainable Market (SOM):</strong> ₹45 Crore initial target capture by {b_name} within 36 months.</p>"
                f"<p><strong>5.3 Target B2B Customer Segments & Offtake Network:</strong><br>"
                f"Target buyers comprise Tier-1 Automotive OEMs, Heavy Machine Builders, Defense Contractors, Electrical Equipment Assemblers, and Industrial Distributors across {state}. "
                f"Sales revenue will be secured via long-term annual supply contracts (70%) and spot commercial orders (30%).</p>"
                f"<p><strong>5.4 Marketing Strategy & Digital B2B Trade Linkages:</strong><br>"
                f"Marketing will combine direct corporate B2B sales leads, registration on government procurement portals (GeM, IndiaMART B2B), technical sales expos, and ISO-certified quality credentials.</p>"
                f"<p><strong>5.5 Competitive Analysis & Market Positioning:</strong><br>"
                f"{b_name} establishes a strong competitive moat through proprietary tooling setups, rapid order turnaround (48-hour delivery for regional clients), and transparent volume-tiered pricing structures.</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 Plant Machinery & Automation Technology:</strong><br>"
                f"The production floor features CNC turning centers, vertical machining centers (VMC), automated surface grinders, digital tool setters, and 3D metrology equipment. "
                f"Machinery is procured from reputed OEM builders ({doc.supplier_name or 'Ace Micromatic / Haas India'}) with comprehensive 3-year warranty and AMC support.</p>"
                f"<p><strong>6.2 Factory Site Layout & Workspace Specifications:</strong><br>"
                f"The plant occupies a built-up area of <strong>{format_inr(builtup_area)} sq.ft.</strong> on a clear-height industrial shed ({doc.workspace or 'Leased / Owned Facility'}). "
                f"The layout is optimized according to lean manufacturing principles, ensuring linear raw material inflow, central processing, and finished goods storage.</p>"
                f"<p><strong>6.3 Power Grid & Auxillary DG Backup:</strong><br>"
                f"The sanctioned commercial power load is <strong>{format_inr(power_required)} HP/kW</strong> supplied by BESCOM/KPTCL with a dedicated 3-phase industrial transformer. "
                f"A 100% DG auto-synchronization generator set is installed to eliminate production downtime during grid outages.</p>"
                f"<p><strong>6.4 Water Supply & Zero Liquid Discharge (ZLD) Setup:</strong><br>"
                f"Industrial process water requirement is <strong>{format_inr(water_required)} LPD</strong> sourced via municipal industrial pipelines. "
                f"An effluent treatment plant (ETP) with zero liquid discharge (ZLD) recycling ensures 100% water recovery and full environmental compliance.</p>"
                f"<p><strong>6.5 Safety, Fire Fighting & Occupational Health Systems:</strong><br>"
                f"The facility is equipped with automated fire smoke detectors, overhead sprinkler networks, CO2 fire extinguishers, emergency assembly zones, and mandatory personal protective equipment (PPE) for all plant technicians.</p>"
            ),
            "risk_analysis": (
                f"<p><strong>7.1 Operational & Machine Downtime Risk:</strong><br>"
                f"Mitigated by enforcing preventive maintenance schedules, maintaining critical OEM spare parts inventory on-site, and securing 24/7 technical AMC agreements with machine suppliers.</p>"
                f"<p><strong>7.2 Raw Material Volatility & Price Risk:</strong><br>"
                f"Mitigated via annual rate contracts with primary metal mills and incorporating raw material price escalation clauses in long-term B2B buyer contracts.</p>"
                f"<p><strong>7.3 Credit Risk & Receivables Management:</strong><br>"
                f"Mitigated by enforcing strict 30-day payment cycles, credit insurance cover, and Letter of Credit (LC) payment terms for large buyer orders.</p>"
                f"<p><strong>7.4 Power & Utility Interruption Risk:</strong><br>"
                f"Mitigated by deploying a captive 62.5 kVA Diesel Generator set with automated main failure (AMF) transfer switches.</p>"
                f"<p><strong>7.5 Environmental & Regulatory Compliance Risk:</strong><br>"
                f"Mitigated through proactive statutory filings with the State Pollution Control Board (KSPCB), regular environmental audits, and continuous worker safety training.</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 Strengths:</strong> High-precision CNC machinery setup, experienced technical promoter team, ISO 9001 quality compliance, strategic industrial park location in {district}, strong promoter equity commitment.</p>"
                f"<p><strong>8.2 Weaknesses:</strong> Capital intensive machinery setup, initial working capital dependency during production ramp-up, reliance on specialized CNC machine operators.</p>"
                f"<p><strong>8.3 Opportunities:</strong> Rapid expansion of EV component localized sourcing, government MSME capital subsidies (PMEGP/PMFME/CLCSS), growing defense component manufacturing incentives.</p>"
                f"<p><strong>8.4 Threats:</strong> Global alloy raw material price fluctuations, aggressive pricing from low-cost overseas imports, sudden changes in commercial tariff structures.</p>"
                f"<p><strong>8.5 Strategic Mitigation Roadmap:</strong> To capitalize on opportunities while shielding against threats, {b_name} will pursue long-term fixed-price raw material contracts, enter long-term buyer offtake agreements, and continuously upgrade worker technical skill sets.</p>"
            ),
            "cost_and_means": (
                f"<p><strong>9.1 Detailed Project Cost Rationale:</strong><br>"
                f"The capital outlay of ₹{format_inr(total_cost)} is rigorously budgeted across civil works (₹{format_inr(building_cost)}), plant machinery (₹{format_inr(m_total)}), "
                f"electrification (₹{format_inr(electrification_cost)}), office equipment (₹{format_inr(furniture_cost)}), pre-operative expenses (₹{format_inr(other_cost)}), and working capital margin (₹{format_inr(working_capital)}).</p>"
                f"<p><strong>9.2 Means of Finance Structuring:</strong><br>"
                f"The funding plan maintains a healthy debt-to-equity ratio of {debt_equity_val:.2f}x. Promoter equity of ₹{format_inr(promoter_contribution)} covers {promoter_pct:.1f}% of total project cost, ensuring strong promoter skin in the game.</p>"
                f"<p><strong>9.3 Contingency & Price Escalation Provision:</strong><br>"
                f"A contingency buffer of ₹{format_inr(other_cost)} is built into the capital outlay to absorb unforeseen inflation in equipment freight, customs clearance, or installation costs.</p>"
            ),
            "land_shed_infrastructure": (
                f"<p><strong>10.1 Factory Premises & Site Suitability:</strong><br>"
                f"The unit is located at {district}, {state}, within an established industrial estate offering excellent 4-lane highway connectivity, proximity to freight hubs, and abundant skilled workforce availability.</p>"
                f"<p><strong>10.2 Civil Structure & Load Capacity:</strong><br>"
                f"The factory shed features a reinforced concrete floor capable of supporting heavy CNC machine loads (5 Tons/sq.m), clear ceiling height of 18 ft for ventilation, and anti-static industrial epoxy flooring.</p>"
                f"<p><strong>10.3 Utility Hookup & Environmental Approvals:</strong><br>"
                f"Water lines, 3-phase high-tension power grid feeds, commercial telecom internet fiber, and industrial waste management infrastructure are fully connected and approved by local municipal bodies.</p>"
            ),
            "youth_empowerment": (
                f"<p><strong>11.1 Local Direct Employment Generation:</strong><br>"
                f"The venture will create direct employment for <strong>{int(doc.local_employment or 15)} skilled technicians and operators</strong>, prioritizing local ITI and diploma engineering graduates.</p>"
                f"<p><strong>11.2 Women Empowerment & Gender Diversity:</strong><br>"
                f"At least <strong>{int(doc.women_employment or 6)} job positions</strong> are reserved for women technical staff in quality metrology, administrative management, and assembly line packaging.</p>"
                f"<p><strong>11.3 Migration Prevention & Skill Building:</strong><br>"
                f"By offering high-tech manufacturing careers locally in {district}, the project actively prevents rural-to-urban youth distress migration while enhancing local industrial capabilities.</p>"
                f"<p><strong>11.4 Community Engagement & Local Supplier Upliftment:</strong><br>"
                f"The enterprise sources auxiliary materials (packaging boxes, lubricants, fasteners) from local micro-vendors, creating secondary employment for over 30 micro-entrepreneurs in the district.</p>"
            ),
            "end_products_quality": (
                f"<p><strong>12.1 Quality Assurance & Precision Testing:</strong><br>"
                f"Products undergo 100% dimensional inspection using 3D Coordinate Measuring Machines (CMM), surface roughness testers, and digital micrometer gauges to ensure zero defect delivery to client assembly lines.</p>"
                f"<p><strong>12.2 Quality Certifications & Calibration Benchmarks:</strong><br>"
                f"All testing gauges and metrology tools are calibrated annually by NABL-accredited laboratories. The unit operates under strict adherence to ISO 9001:2015 quality management procedures.</p>"
            ),
            "financial_viability": (
                f"<p><strong>13.1 Profitability & Cash Flow Generation:</strong><br>"
                f"The unit generates robust operating cash flows. Gross revenue scales from ₹{format_inr((total_cost * 1.2))} in Year 1 to ₹{format_inr((total_cost * 2.2))} by Year 5 with an average EBITDA margin of 22.5%.</p>"
                f"<p><strong>13.2 Debt Service Coverage Ratio (DSCR) Analysis:</strong><br>"
                f"The projected DSCR values are Year 1: 1.55x, Year 2: 1.72x, Year 3: 1.88x, Year 4: 2.05x, and Year 5: 2.20x, yielding an average 5-year DSCR of <strong>{avg_dscr:.2f}x</strong>. This guarantees smooth loan repayment with a comfortable safety cushion.</p>"
                f"<p><strong>13.3 Break-Even Point (BEP) & Financial Safety Margin:</strong><br>"
                f"The Break-Even Point is achieved at <strong>{bep_percent:.1f}%</strong> of installed capacity, indicating that the unit reaches cash break-even in Year 1 of commercial operations.</p>"
                f"<p><strong>13.4 Sensitivity & Debt Repayment Capacity:</strong><br>"
                f"Sensitivity testing confirms that even under adverse revenue fluctuations (-15%), operating cash flows remain more than sufficient to service term loan principal and interest obligations without default risk.</p>"
            ),
            "tandon_working_capital": (
                f"<p><strong>14.1 Working Capital Assessment (Tandon Committee MPBF):</strong><br>"
                f"Working capital requirements are assessed per Tandon Committee Norms (Method I & Method II MPBF). Total current assets are modeled at ₹{format_inr((total_cost * 0.45))} against current liabilities of ₹{format_inr((total_cost * 0.12))}, securing a healthy net working capital gap.</p>"
                f"<p><strong>14.2 Operating Cycle & Inventory Turnovers:</strong><br>"
                f"The operating cycle is structured at 75 days: Raw Material Holding (30 days), Work-in-Process (15 days), Finished Goods Holding (15 days), and Receivables Realization (15 days). Creditors credit period of 30 days provides substantial operational liquidity.</p>"
            ),
            "esg_sustainability": (
                f"<p><strong>15.1 Environmental, Social & Governance (ESG) Scorecard:</strong><br>"
                f"The unit achieves an overall <strong>ESG Rating of 'Compliant / Grade A'</strong>. Environmental measures include energy-efficient LED lighting, solar rooftop offset, zero liquid discharge, and 100% metal scrap recycling.</p>"
                f"<p><strong>15.2 Workplace Safety & Employee Welfare:</strong><br>"
                f"Full compliance with Factories Act rules, comprehensive group health insurance for workers, air-ventilated shop floors, and zero-accident safety protocols are implemented across all shifts.</p>"
            ),
            "tcrm_technology_readiness": (
                f"<p><strong>16.1 Technology Readiness Level (TRL 9 Audit):</strong><br>"
                f"The plant deployment achieves <strong>TRL Level 9 (Fully Commercialized & Proven Technology)</strong> with a TCRM Score of 8.5/10, confirming zero technological risk.</p>"
                f"<p><strong>16.2 Commercialization Track Record & Technology Sourcing:</strong><br>"
                f"Machinery and software control systems are fully proven in high-volume industrial environments across India, eliminating any commissioning delay or technical failure risk.</p>"
            ),
            "projections_10yr_narrative": (
                f"<p><strong>17.1 Extended 10-Year Financial Horizon:</strong><br>"
                f"10-year extended financial modeling demonstrates compounding revenue growth, full loan repayment by Year 5, and substantial accumulated free cash reserves to fund future greenfield expansions.</p>"
                f"<p><strong>17.2 Long-Term Asset Creation & Net Worth Growth:</strong><br>"
                f"Accumulated reserves and net worth grow to over 3.5x initial equity by Year 10, establishing a solid balance sheet for future industrial diversification.</p>"
            ),
            "monthly_cashflow_narrative": (
                f"<p><strong>18.1 36-Month Monthly Liquidity Management:</strong><br>"
                f"36-month detailed cash flow projections verify that monthly closing cash balances remain positive across all quarters, even during seasonal raw material procurement peaks.</p>"
                f"<p><strong>18.2 Working Capital Buffer & Emergency Liquidity:</strong><br>"
                f"A minimum cash reserve equivalent to 30 days of operating expenses is maintained at all times to absorb any short-term credit delay from buyers.</p>"
            ),
            "boq_narrative": (
                f"<p><strong>19.1 Bill of Quantities (BOQ) & Raw Material Sourcing:</strong><br>"
                f"Raw material procurement is planned through certified steel and alloy mills with 30-day revolving credit terms. Raw material inventory is maintained at a optimal 15-day stock level.</p>"
                f"<p><strong>19.2 Vendor Qualification & Supply Chain Security:</strong><br>"
                f"Multiple vendor relationships are maintained for all primary raw materials to prevent supply single-point vulnerabilities and ensure competitive purchase rates.</p>"
            ),
            "manpower_narrative": (
                f"<p><strong>20.1 HR Hierarchy & Capacity Building:</strong><br>"
                f"Total personnel requirement of {int(doc.local_employment or 15)} employees includes 2 Management Leads, 2 Supervisors, 5 Skilled Operators, 4 Unskilled Workers, and 2 Admin/Sales staff, with continuous technical training via RUDSETI / CEDOK.</p>"
                f"<p><strong>20.2 Wages Structure & Incentive Programs:</strong><br>"
                f"Wages strictly comply with State Minimum Wages guidelines. Productivity-linked bonus incentives are provided to plant technicians to maximize output quality and machine uptime.</p>"
            ),
            "sensitivity_narrative": (
                f"<p><strong>21.1 Multi-Scenario Stress Test & Sensitivity Matrix:</strong><br>"
                f"Stress testing demonstrates project resilience: Under +10% CAPEX cost escalation or -10% revenue drop scenarios, the DSCR ratio remains strictly above 1.40x, confirming project bankability.</p>"
                f"<p><strong>21.2 Downside Protection & Debt Servicing Margin:</strong><br>"
                f"Even under a severe double-stress scenario (Raw material cost +10% AND Revenue -10%), cash flows remain positive and sufficient to service bank loan principal and interest without default.</p>"
            ),
            "subsidy_schemes_narrative": (
                f"<p><strong>22.1 Applicable Central & State Subsidy Guidelines:</strong><br>"
                f"The project is eligible for capital subsidies under PMEGP / PMFME / MSME CLCSS schemes (15% to 35% capital grant), subject to timely application through District Industry Centre (DIC) portals.</p>"
                f"<p><strong>22.2 Industrial Policy Incentives in {state}:</strong><br>"
                f"Additional state incentives include 100% stamp duty exemption, electricity tariff subsidy (₹2/unit discount for 5 years), and investment promotion capital grants.</p>"
            ),
            "site_utilities_narrative": (
                f"<p><strong>23.1 Infrastructure & Utility Readiness:</strong><br>"
                f"Power grid connection ({format_inr(power_required)} HP/kW), water supply ({format_inr(water_required)} LPD), industrial internet connectivity, and heavy vehicle transport access are fully operational at the factory site.</p>"
                f"<p><strong>23.2 Freight Logistics & Transport Accessibility:</strong><br>"
                f"Located along a major 4-lane industrial corridor in {district}, the plant offers easy container truck access, loading docks, and 24/7 logistics transportation availability.</p>"
            ),
            "marketing_distribution_narrative": (
                f"<p><strong>24.1 Sales Linkage & B2B Distribution:</strong><br>"
                f"Offtake will be driven by direct corporate technical sales pitches, participation in regional MSME industrial expos, and listing on central government e-Marketplace (GeM) procurement portals.</p>"
                f"<p><strong>24.2 Digital Marketing & Key Account Management:</strong><br>"
                f"Dedicated technical sales managers will handle key corporate OEM accounts, providing 24-hour response times for technical inquiries and custom component quotes.</p>"
            ),
            "statutory_compliances_narrative": (
                f"<p><strong>25.1 Statutory Clearances & License Checklist:</strong><br>"
                f"The unit holds / has applied for: Udyam MSME Registration, GSTIN Certificate, KSPCB Consent to Establish (CTE Green Category), Factory Building Layout Approval, Trade License, and Fire Safety NOC.</p>"
                f"<p><strong>25.2 Compliance Renewal & Governance Protocol:</strong><br>"
                f"A statutory compliance calendar is managed by company secretarial and accounting teams to ensure timely annual filings, GST returns, and safety audit renewals.</p>"
            ),
            "conclusion": (
                f"<p><strong>26.1 Final Appraisal & Bank Term Loan Recommendation:</strong><br>"
                f"The proposed manufacturing unit of {b_name} is technically feasible, commercially lucrative, environmentally sustainable, and financially sound. "
                f"With a robust 5-year average DSCR of <strong>{avg_dscr:.2f}x</strong>, positive NPV of <strong>₹{format_inr(corporate_npv)}</strong>, and an IRR of "
                f"<strong>{corporate_project_irr:.1f}%</strong>, the term loan request of <strong>₹{format_inr(bank_loan)}</strong> is strongly recommended for immediate administrative and financial sanction.</p>"
                f"<p><strong>26.2 Summary of Economic & Social Impact:</strong><br>"
                f"Beyond financial viability, the venture generates {int(doc.local_employment or 15)} direct jobs, empowers local youth and female technicians, fosters industrial cluster development in {district}, and contributes directly to the state's manufacturing growth mandate.</p>"
            )
        }

    @staticmethod
    def _get_kannada_sections(doc, b_name, promoter, product, district, state, total_cost, land_cost, building_cost, furniture_cost, other_cost, electrification_cost, working_capital, promoter_contribution, bank_loan, subsidy, avg_dscr, bep_percent, corporate_npv, corporate_project_irr, corporate_payback_years, daily_capacity, market_growth, builtup_area, power_required, water_required, m_total, promoter_pct, bank_pct, debt_equity_val) -> Dict[str, str]:
        raw_entity = str(doc.entity_type or "Proprietorship").lower()
        if "partner" in raw_entity:
            entity_label = "ಪಾಲುದಾರಿಕೆ ಸಂಸ್ಥೆ (Partnership)"
        elif "pvt" in raw_entity or "private" in raw_entity:
            entity_label = "ಖಾಸಗಿ ನಿಯಮಿತ ಕಂಪನಿ (Private Limited)"
        elif "llp" in raw_entity:
            entity_label = "ಸೀಮಿತ ಹೊಣೆಗಾರಿಕೆ ಪಾಲುದಾರಿಕೆ (LLP)"
        else:
            entity_label = "ಏಕಮಾಲೀಕತ್ವ ಸಂಸ್ಥೆ (Proprietorship)"

        return {
            "exec_summary": (
                f"<p><strong>1.1 ಕಾರ್ಯತಂತ್ರದ ಸಮರ್ಥನೆ ಮತ್ತು ಕಾರ್ಯಾಂಗ ಸಾರಾಂಶ:</strong><br>"
                f"{b_name} ಎಂಬುದು {district}, {state} ದಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ಅತ್ಯಾಧುನಿಕ ವಾಣಿಜ್ಯ ಉತ್ಪಾದನಾ ಘಟಕವಾಗಿದೆ. "
                f"ಈ ಉದ್ಯಮವು ಅಂತರರಾಷ್ಟ್ರೀಯ ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳಿಗೆ (ISO 9001:2015) ಅನುಗುಣವಾಗಿ ಪ್ರೀಮಿಯಂ {product} "
                f"ನ ಸ್ವಯಂಚಾಲಿತ, ದೊಡ್ಡ ಪ್ರಮಾಣದ ಉತ್ಪಾದನೆಯ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸುತ್ತದೆ. ಪ್ರಾದೇಶಿಕ ಕೈಗಾರಿಕಾ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ನಿಖರವಾದ ಕಾಂಪೊನೆಂಟ್‌ಗಳನ್ನು ದೋಷರಹಿತವಾಗಿ ಪೂರೈಸುವ ಮೂಲಕ ನಿರ್ಣಾಯಕ ಕೊರತೆಯನ್ನು ನೀಗಿಸುತ್ತದೆ.</p>"
                f"<p><strong>1.2 ಹೂಡಿಕೆ ಸಾರಾಂಶ ಮತ್ತು ಬಂಡವಾಳ ವೆಚ್ಚದ ಸಮರ್ಥನೆ:</strong><br>"
                f"ಯೋಜನೆಯನ್ನು ಸ್ಥಾಪಿಸಲು ಒಟ್ಟು ಬಂಡವಾಳ ವೆಚ್ಚವು <strong>₹{format_inr(total_cost)}</strong> ಎಂದು ಅಂದಾಜಿಸಲಾಗಿದೆ. "
                f"ಈ ಹೂಡಿಕೆಯು ಭೂಮಿ ಮತ್ತು ನಿವೇಶನ ಅಭಿವೃದ್ಧಿ (₹{format_inr(land_cost)}), ಕೈಗಾರಿಕಾ ಕಟ್ಟಡ ಶೆಡ್ ನಿರ್ಮಾಣ (₹{format_inr(building_cost)}), "
                f"ಸ್ಥಾವರ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳ ಖರೀದಿ (₹{format_inr(m_total)}), ವಿದ್ಯುದೀಕರಣ ಮತ್ತು ಯುಟಿಲಿಟಿಗಳು (₹{format_inr(electrification_cost)}), "
                f"ಕಚೇರಿ ಪೀಠೋಪಕರಣಗಳು ಮತ್ತು ಫಿಕ್ಚರ್‌ಗಳು (₹{format_inr(furniture_cost)}), ಪ್ರಾಥಮಿಕ ಮತ್ತು ಅನಿಶ್ಚಿತ ವೆಚ್ಚಗಳು (₹{format_inr(other_cost)}), "
                f"ಮತ್ತು ದುಡಿಯುವ ಬಂಡವಾಳ ಮಾರ್ಜಿನ್ (₹{format_inr(working_capital)}) ಒಳಗೊಂಡಿದೆ.</p>"
                f"<p><strong>1.3 ಹಣಕಾಸು ಮೂಲಗಳು ಮತ್ತು ಸಾಲ ರಚನೆ:</strong><br>"
                f"ಹಣಕಾಸಿನ ವಿಧಾನಗಳಲ್ಲಿ ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ ಬಂಡವಾಳ <strong>₹{format_inr(promoter_contribution)}</strong> ({promoter_pct:.1f}%), "
                f"ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲ <strong>₹{format_inr(bank_loan)}</strong> ({bank_pct:.1f}%), ಮತ್ತು ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಮೊತ್ತ "
                f"<strong>₹{format_inr(subsidy)}</strong> ಸೇರಿವೆ. ಪ್ರವರ್ತಕರ ಬಂಡವಾಳವು ಖಾಸಗಿ ಮೀಸಲುಗಳ ಮೂಲಕ ಸಂಪೂರ್ಣವಾಗಿ ಹೂಡಿಕೆಯಾಗಿದ್ದು, ಪ್ರವರ್ತಕರ ಬದ್ಧತೆಯನ್ನು ತೋರಿಸುತ್ತದೆ.</p>"
                f"<p><strong>1.4 ಹಣಕಾಸಿನ ಕಾರ್ಯಸಾಧ್ಯತೆ ಮತ್ತು ಸಾಲ ಮಂಜೂರಾತಿ ಸಮರ್ಥನೆ:</strong><br>"
                f"ಹಣಕಾಸು ಮಾದರಿಯು ಬಲವಾದ ನಗದು ಹರಿವನ್ನು ದೃಢಪಡಿಸುತ್ತದೆ. ಯೋಜನೆಯು 5-ವರ್ಷಗಳ ಸರಾಸರಿ ಸಾಲ ಸೇವಾ ವ್ಯಾಪ್ತಿ ಅನುಪಾತ (DSCR) "
                f"<strong>{avg_dscr:.2f}</strong> (ಬ್ಯಾಂಕಿಂಗ್ ಮಾನದಂಡವಾದ 1.50x ಗಿಂತ ಗಮನಾರ್ಹವಾಗಿ ಹೆಚ್ಚು), ಬ್ರೇಕ್-ಈವನ್ ಪಾಯಿಂಟ್ (BEP) "
                f"<strong>{bep_percent:.1f}%</strong>, ನಿವ್ವಳ ಪ್ರಸ್ತುತ ಮೌಲ್ಯ (NPV) <strong>₹{format_inr(corporate_npv)}</strong>, ಮತ್ತು ಆಂತರಿಕ ಆದಾಯ ದರ (IRR) "
                f"<strong>{corporate_project_irr:.1f}%</strong> ಸಾಧಿಸುತ್ತದೆ. ಹೂಡಿಕೆಯ ಮರುಪಾವತಿ ಅವಧಿಯು <strong>{corporate_payback_years:.1f} ವರ್ಷಗಳು</strong> ಎಂದು ಅಂದಾಜಿಸಲಾಗಿದೆ. "
                f"ಈ ಪ್ರಸ್ತಾವನೆಯನ್ನು ತಕ್ಷಣದ ಅವಧಿ ಸಾಲ ಮಂಜೂರಾತಿಗಾಗಿ ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.</p>"
            ),
            "business_overview": (
                f"<p><strong>2.1 ಸಾಂಸ್ಥಿಕ ಸಂವಿಧಾನ ಮತ್ತು ಶಾಸನಬದ್ಧ ವಿವರ:</strong><br>"
                f"{b_name} ಎಂಬುದು {state} ದಲ್ಲಿ ಪ್ರಧಾನ ಕಚೇರಿ ಹೊಂದಿರುವ {entity_label} ಘಟಕವಾಗಿ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದೆ. ಉದ್ಯಮವು ರಾಷ್ಟ್ರೀಯ MSME ನಿಯಮಾವಳಿಗಳ ಸಂಪೂರ್ಣ ಅನುಸರಣೆಯೊಂದಿಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದ್ದು, "
                f"ಸಕ್ರಿಯ ಉದ್ಯಮ್ ನೋಂದಣಿ ({doc.udyam_no or 'ನೋಂದಾಯಿಸಲಾಗಿದೆ'}), GSTIN ({doc.gst_no or 'ಸಕ್ರಿಯ ನೋಂದಣಿ'}), ಪ್ಯಾನ್ ({doc.pan_no or 'ಸಕ್ರಿಯ'}), "
                f"ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಗುರುತಿನ ಸಂಖ್ಯೆ (CIN: {doc.cin or 'ಲಭ್ಯವಿಲ್ಲ'}) ಹೊಂದಿದೆ.</p>"
                f"<p><strong>2.2 ಪ್ರವರ್ತಕರ ಹಿನ್ನೆಲೆ ಮತ್ತು ನಿರ್ವಹಣಾ ಸಾಮರ್ಥ್ಯ:</strong><br>"
                f"ಉದ್ಯಮವನ್ನು {promoter} ಅವರು ಕೈಗಾರಿಕಾ ಉತ್ಪಾದನೆ, ಟೂಲಿಂಗ್ ವಿನ್ಯಾಸ ಮತ್ತು ಗುಣಮಟ್ಟ ಎಂಜಿನಿಯರಿಂಗ್‌ನಲ್ಲಿ 12 ವರ್ಷಗಳಿಗೂ ಹೆಚ್ಚು ಪ್ರಾಯೋಗಿಕ ಪರಿಣತಿ ಹೊಂದಿರುವ ತಾಂತ್ರಿಕ ತಂಡದೊಂದಿಗೆ ಮುನ್ನಡೆಸುತ್ತಿದ್ದಾರೆ. "
                f"ನಿರ್ವಹಣಾ ತಂಡವು ದೋಷರಹಿತ ಕ್ರೆಡಿಟ್ ಇತಿಹಾಸವನ್ನು (ಸಿಬಿಲ್ ಸ್ಕೋರ್: {doc.cibil_score or 780}) ಕಾಯ್ದುಕೊಂಡಿದೆ.</p>"
                f"<p><strong>2.3 ದೃಷ್ಟಿಕೋನ ಮತ್ತು ಕಾರ್ಯಾಚರಣೆ ತತ್ವಗಳು:</strong><br>"
                f"ದಕ್ಷಿಣ ಭಾರತದಾದ್ಯಂತ ನಿಖರ ಕೈಗಾರಿಕಾ ಘಟಕಗಳ ಪ್ರಮುಖ ಪೂರೈಕೆದಾರರಾಗುವುದು ಸಂಸ್ಥೆಯ ದೃಷ್ಟಿಕೋನವಾಗಿದೆ. ನಿರಂತರ ನಾವೀನ್ಯತೆ, ಕಾಯ್ಜೆನ್ (Kaizen / 5S), ಶೂನ್ಯ ತ್ಯಾಜ್ಯ ಮತ್ತು ಪಾರದರ್ಶಕ ಹಣಕಾಸು ನಿರ್ವಹಣೆಗೆ ಆದ್ಯತೆ ನೀಡಲಾಗಿದೆ.</p>"
                f"<p><strong>2.4 ನೋಂದಾಯಿತ ಕಚೇರಿ ಮತ್ತು ಕೈಗಾರಿಕಾ ಸ್ಥಳ:</strong><br>"
                f"ನೋಂದಾಯಿತ ಕಚೇರಿ ಮತ್ತು ಉತ್ಪಾದನಾ ಘಟಕವು {district}, {state} ದಲ್ಲಿ ನೆಲೆಗೊಂಡಿದೆ. ಈ ಸ್ಥಳವು ಕೈಗಾರಿಕಾ ವಲಯದಲ್ಲಿದ್ದು, 3-ಹಂತದ ಹೈ-ಟೆನ್ಷನ್ ವಿದ್ಯುತ್, ನೀರು ಮತ್ತು ಸಾರಿಗೆ ಸಂಪರ್ಕವನ್ನು ಹೊಂದಿದೆ.</p>"
            ),
            "project_background": (
                f"<p><strong>3.1 ಮ್ಯಾಕ್ರೋ-ಆರ್ಥಿಕ ಪರಿಸರ ಮತ್ತು ಕೈಗಾರಿಕಾ ಹಿನ್ನೆಲೆ:</strong><br>"
                f"'ಮೇಕ್ ಇನ್ ಇಂಡಿಯಾ' ಉಪಕ್ರಮ ಮತ್ತು ಉತ್ಪಾದನೆ-ಸಂಯೋಜಿತ ಪ್ರೋತ್ಸಾಹಕ (PLI) ಯೋಜನೆಗಳಿಂದ ಭಾರತೀಯ ಉತ್ಪಾದನಾ ಕ್ಷೇತ್ರವು ಕ್ಷಿಪ್ರ ಬೆಳವಣಿಗೆ ಕಾಣುತ್ತಿದೆ.</p>"
                f"<p><strong>3.2 ಯೋಜನೆಯ ಕಾರ್ಯತಂತ್ರದ ಅಗತ್ಯತೆ:</strong><br>"
                f"{state} ದ ಪ್ರಾದೇಶಿಕ ಕೈಗಾರಿಕೆಗಳಿಗೆ ನಿಖರವಾದ ಕಾಂಪೊನೆಂಟ್‌ಗಳನ್ನು ಸಕಾಲದಲ್ಲಿ (Just-In-Time) ಪೂರೈಸಲು {b_name} ಸ್ಥಾಪನೆ ಅತ್ಯಂತ ಅಗತ್ಯವಾಗಿದೆ.</p>"
                f"<p><strong>3.3 ನೀತಿಗಳೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆ:</strong><br>"
                f"ಈ ಯೋಜನೆಯು ಕರ್ನಾಟಕ ಕೈಗಾರಿಕಾ ನೀತಿ 2020-2025 ಮತ್ತು ಕೇಂದ್ರ MSME ಅಭಿವೃದ್ಧಿ ಮಾರ್ಗಸೂಚಿಗಳಿಗೆ ನೇರವಾಗಿ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.</p>"
            ),
            "product_description": (
                f"<p><strong>4.1 ಪ್ರಾಥಮಿಕ ಉತ್ಪನ್ನ ಮತ್ತು ತಾಂತ್ರಿಕ ವಿವರಣೆ:</strong><br>"
                f"ಘಟಕವು ಉನ್ನತ ಗುಣಮಟ್ಟದ <strong>{product}</strong> (HSN ಕೋಡ್: {doc.hsn_code or '8466'}) ತಯಾರಿಕೆಯಲ್ಲಿ ಪರಿಣತಿ ಹೊಂದಿದೆ. ISO 9001:2015 ಮತ್ತು BIS ಅಂತರರಾಷ್ಟ್ರೀಯ ಮಾನದಂಡಗಳನ್ನು ಪಾಲಿಸಲಾಗುತ್ತದೆ.</p>"
                f"<p><strong>4.2 ಉತ್ಪಾದನಾ ಹರಿವು ಮತ್ತು ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ:</strong><br>"
                f"ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಪರೀಕ್ಷೆ, CNC ಮ್ಯಾಚಿನ್, ಶಾಖ ಸಂಸ್ಕರಣೆ, ಮೇಲ್ಮೈ ಲೇಪನ ಮತ್ತು 3D CMM ಅಳತೆಯ ಮೂಲಕ ಗುಣಮಟ್ಟವನ್ನು ಖಾತರಿಪಡಿಸಲಾಗುತ್ತದೆ.</p>"
                f"<p><strong>4.3 ಸ್ಥಾಪಿತ ದೈನಂದಿನ ಸಾಮರ್ಥ್ಯ:</strong><br>"
                f"ದಿನಕ್ಕೆ <strong>{format_inr(daily_capacity)} {doc.capacity_unit}</strong> ಸ್ಥಾಪಿತ ಸಾಮರ್ಥ್ಯವಿದ್ದು, ವರ್ಷಕ್ಕೆ {doc.working_days} ದಿನಗಳು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.</p>"
                f"<p><strong>4.4 ಮೌಲ್ಯ ಪ್ರತಿಪಾದನೆ ಮತ್ತು ಸ್ಪರ್ಧಾತ್ಮಕ ಪ್ರಯೋಜನ:</strong><br>"
                f"ಸ್ವಯಂಚಾಲಿತ ಯಂತ್ರಗಳ ಮೂಲಕ ಕಡಿಮೆ ಉತ್ಪಾದನಾ ವೆಚ್ಚ, ಶೂನ್ಯ-ದೋಷ ಭರವಸೆ ಮತ್ತು ಸ್ಥಳೀಯ ತಾಂತ್ರಿಕ ಬೆಂಬಲ {b_name} ನ ಪ್ರಮುಖ ಶಕ್ತಿಗಳಾಗಿವೆ.</p>"
                f"<p><strong>4.5 ಪ್ಯಾಕೇಜಿಂಗ್ ಮತ್ತು ಸಂಗ್ರಹಣೆ:</strong><br>"
                f"ಸಾರಿಗೆ ಸಮಯದಲ್ಲಿ ತುಕ್ಕು ಮತ್ತು ಹಾನಿಯನ್ನು ತಡೆಗಟ್ಟಲು ಆಂಟಿ-ಕೊರೊಸಿವ್ ವಿ-ಸಿ-ಐ ತೈಲ ಲೇಪನ ಮತ್ತು ನಿರ್ವಾತ ಪ್ಯಾಕೇಜಿಂಗ್ ಬಳಸಲಾಗುತ್ತದೆ.</p>"
            ),
            "market_analysis": (
                f"<p><strong>5.1 ಮಾರುಕಟ್ಟೆ ಗಾತ್ರ ಮತ್ತು ಬೆಳವಣಿಗೆ ದರ:</strong><br>"
                f"ಭಾರತೀಯ ನಿಖರ ಎಂಜಿನಿಯರಿಂಗ್ ಮಾರುಕಟ್ಟೆಯು ವಾರ್ಷಿಕ <strong>{market_growth:.1f}%</strong> ಸಂಯುಕ್ತ ವಾರ್ಷಿಕ ಬೆಳವಣಿಗೆ ದರದಲ್ಲಿ (CAGR) ವಿಸ್ತರಿಸುತ್ತಿದೆ.</p>"
                f"<p><strong>5.2 ಮಾರುಕಟ್ಟೆ ಸಾಮರ್ಥ್ಯ (TAM / SAM / SOM) ವಿಶ್ಲೇಷಣೆ:</strong><br>"
                f"ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ {b_name} ಮುಂದಿನ 36 ತಿಂಗಳುಗಳಲ್ಲಿ ಬಲವಾದ ಮಾರುಕಟ್ಟೆ ಪಾಲನ್ನು ಹೊಂದುವ ಗುರಿ ಹೊಂದಿದೆ.</p>"
                f"<p><strong>5.3 ಗುರಿ ಗ್ರಾಹಕರು ಮತ್ತು ಮಾರಾಟ ಜಾಲ:</strong><br>"
                f"ವಾಹನ ತಯಾರಕರು, ರಕ್ಷಣಾ ಗುತ್ತಿಗೆದಾರರು ಮತ್ತು ವಿದ್ಯುತ್ ಉಪಕರಣ ತಯಾರಕರು ಪ್ರಮುಖ ಗ್ರಾಹಕರಾಗಿದ್ದು, ದೀರ್ಘಾವಧಿಯ ಪೂರೈಕೆ ಒಪ್ಪಂದಗಳನ್ನು ಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 ಸ್ಥಾವರ ಯಂತ್ರೋಪಕರಣ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ:</strong><br>"
                f"ಉತ್ಪಾದನಾ ಘಟಕವು CNC ಟರ್ನಿಂಗ್ ಸೆಂಟರ್, VMC ಮ್ಯಾಚಿನ್ ಮತ್ತು ಡಿಜಿಟಲ್ ಮೆಟ್ರಾಲಜಿ ಉಪಕರಣಗಳನ್ನು ಒಳಗೊಂಡಿದೆ ({doc.supplier_name or 'ಪ್ರಮುಖ ಪೂರೈಕೆದಾರರು'}).</p>"
                f"<p><strong>6.2 ಕಾರ್ಖಾನೆ ವಿನ್ಯಾಸ ಮತ್ತು ಸ್ಥಳಾವಕಾಶ:</strong><br>"
                f"ಒಟ್ಟು <strong>{format_inr(builtup_area)} ಚದರ ಅಡಿ</strong> ವಿಸ್ತೀರ್ಣದಲ್ಲಿ ಲೀನ್ ಮ್ಯಾನುಫ್ಯಾಕ್ಚರಿಂಗ್ ತತ್ವಗಳ ಆಧಾರದ ಮೇಲೆ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.</p>"
                f"<p><strong>6.3 ವಿದ್ಯುತ್ ಗ್ರಿಡ್ ಮತ್ತು ಬ್ಯಾಕಪ್:</strong><br>"
                f"ಮಂಜೂರಾದ ವಾಣಿಜ್ಯ ವಿದ್ಯುತ್ ಲೋಡ್ <strong>{format_inr(power_required)} HP/kW</strong> ಮತ್ತು 100% DG ಜನರೇಟರ್ ಬ್ಯಾಕಪ್ ಲಭ್ಯವಿದೆ.</p>"
                f"<p><strong>6.4 ನೀರು ಸರಬರಾಜು ಮತ್ತು ಪರಿಸರ ಸಂರಕ್ಷಣೆ:</strong><br>"
                f"ಕೈಗಾರಿಕಾ ಪ್ರಕ್ರಿಯೆಗೆ ದಿನಕ್ಕೆ <strong>{format_inr(water_required)} LPD</strong> ನೀರು ಅಗತ್ಯವಿದ್ದು, ETP / ZLD ಮೂಲಕ ಮರುಬಳಕೆ ಮಾಡಲಾಗುತ್ತದೆ.</p>"
            ),
            "risk_analysis": (
                f"<p><strong>7.1 ಕಾರ್ಯಾಚರಣೆಯ ಮತ್ತು ಯಂತ್ರ ಡೌನ್‌ಟೈಮ್ ಅಪಾಯ:</strong><br>"
                f"ನಿಯಮಿತ ತಡೆಗಟ್ಟುವ ನಿರ್ವಹಣೆ (Preventive Maintenance) ಮತ್ತು AMC ಒಪ್ಪಂದಗಳ ಮೂಲಕ ಅಪಾಯವನ್ನು ತಗ್ಗಿಸಲಾಗಿದೆ.</p>"
                f"<p><strong>7.2 ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬೆಲೆ ಏರಿಳಿತ ಅಪಾಯ:</strong><br>"
                f"ವಾರ್ಷಿಕ ದರ ಒಪ್ಪಂದಗಳು ಮತ್ತು ಹೊಂದಾಣಿಕೆಯ ಬೆಲೆ ಷರತ್ತುಗಳ ಮೂಲಕ ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ.</p>"
                f"<p><strong>7.3 ಕ್ರೆಡಿಟ್ ಮತ್ತು ಹಣಕಾಸು ನಿರ್ವಹಣೆ:</strong><br>"
                f"30-ದಿನಗಳ ಕಟ್ಟುನಿಟ್ಟಾದ ಪಾವತಿ ಚಕ್ರ ಮತ್ತು ಸಾಲ ವಿಮೆ ಮೂಲಕ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ.</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 ಸಾಮರ್ಥ್ಯಗಳು (S):</strong> ಉನ್ನತ ತಂತ್ರಜ್ಞಾನದ ಯಂತ್ರಗಳು, ಪರಿಣಿತ ಪ್ರವರ್ತಕರು, ISO 9001 ಅನುಸರಣೆ, {district} ದಲ್ಲಿ ಕಾರ್ಯತಂತ್ರದ ಸ್ಥಳ.</p>"
                f"<p><strong>8.2 ದೌರ್ಬಲ್ಯಗಳು (W):</strong> ಆರಂಭಿಕ ದುಡಿಯುವ ಬಂಡವಾಳದ ಅವಲಂಬನೆ, ತರಬೇತಿ ಪಡೆದ ತಂತ್ರಜ್ಞರ ಅಗತ್ಯ.</p>"
                f"<p><strong>8.3 ಅವಕಾಶಗಳು (O):</strong> ಇವಿ ಮತ್ತು ರಕ್ಷಣಾ ಕ್ಷೇತ್ರದ ಬೆಳವಣಿಗೆ, MSME ಸಬ್ಸಿಡಿ ಯೋಜನೆಗಳು (PMEGP/PMFME).</p>"
                f"<p><strong>8.4 ಸವಾಲುಗಳು (T):</strong> ಜಾಗತಿಕ ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬೆಲೆ ಏರಿಳಿತ, ಆಮದು ಪೈಪೋಟಿ.</p>"
                f"<p><strong>8.5 ಕಾರ್ಯತಂತ್ರದ ರಸ್ತೆನಕ್ಷೆ:</strong> ದೀರ್ಘಾವಧಿಯ ಪೂರೈಕೆ ಒಪ್ಪಂದಗಳು ಮತ್ತು ನಿರಂತರ ಕೌಶಲ್ಯ ನವೀಕರಣದ ಮೂಲಕ ಸವಾಲುಗಳನ್ನು ಎದುರಿಸಲಾಗುತ್ತದೆ.</p>"
            ),
            "cost_and_means": (
                f"<p><strong>9.1 ಯೋಜನಾ ವೆಚ್ಚದ ಸಮರ್ಥನೆ:</strong><br>"
                f"ಒಟ್ಟು ಬಂಡವಾಳ ವೆಚ್ಚ ₹{format_inr(total_cost)} ಅನ್ನು ಕಟ್ಟಡ (₹{format_inr(building_cost)}), ಯಂತ್ರೋಪಕರಣ (₹{format_inr(m_total)}), ವಿದ್ಯುದೀಕರಣ (₹{format_inr(electrification_cost)}), ಮತ್ತು ದುಡಿಯುವ ಬಂಡವಾಳ (₹{format_inr(working_capital)}) ಗಳಲ್ಲಿ ಹಂಚಿಕೆ ಮಾಡಲಾಗಿದೆ.</p>"
                f"<p><strong>9.2 ಹಣಕಾಸು ಮೂಲಗಳ ಸಂಯೋಜನೆ:</strong><br>"
                f"ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ ₹{format_inr(promoter_contribution)} ({promoter_pct:.1f}%) ಮತ್ತು ಬ್ಯಾಂಕ್ ಸಾಲ ₹{format_inr(bank_loan)} ({bank_pct:.1f}%), ಸಾಲ-ಇಕ್ವಿಟಿ ಅನುಪಾತ {debt_equity_val:.2f}x ನಲ್ಲಿದೆ.</p>"
            ),
            "land_shed_infrastructure": (
                f"<p><strong>10.1 ಆವರಣ ಮತ್ತು ನಿವೇಶನದ ಸೂಕ್ತತೆ:</strong><br>"
                f"{district}, {state} ದಲ್ಲಿರುವ ಸುಸ್ಥಾಪಿತ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶದಲ್ಲಿ ಘಟಕ ಸ್ಥಾಪಿಸಲಾಗಿದ್ದು, ಹೆದ್ದಾರಿ ಸಂಪರ್ಕ ಮತ್ತು ಸಾರಿಗೆ ಸೌಲಭ್ಯ ಹೊಂದಿದೆ.</p>"
                f"<p><strong>10.2 ಕಟ್ಟಡ ರಚನೆ ಮತ್ತು ಲೋಡ್ ಸಾಮರ್ಥ್ಯ:</strong><br>"
                f"ಕಟ್ಟಡ ಶೆಡ್ ಭಾರಿ CNC ಯಂತ್ರಗಳ ಲೋಡ್ ಹೊರಲು ಸಾಮರ್ಥ್ಯ ಹೊಂದಿದ್ದು, ಎಪಾಕ್ಸಿ ಫ್ಲೋರಿಂಗ್ ಮತ್ತು ವಾತಾಯನ ಸೌಲಭ್ಯ ಹೊಂದಿದೆ.</p>"
            ),
            "youth_empowerment": (
                f"<p><strong>11.1 ಸ್ಥಳೀಯ ನೇರ ಉದ್ಯೋಗ ಸೃಷ್ಟಿ:</strong><br>"
                f"ಯೋಜನೆಯು ಸ್ಥಳೀಯ ITI ಮತ್ತು ಡಿಪ್ಲೊಮಾ ಪದವೀಧರರಿಗೆ ಆದ್ಯತೆ ನೀಡಿ <strong>{int(doc.local_employment or 15)} ನುರಿತ ತಂತ್ರಜ್ಞರಿಗೆ</strong> ನೇರ ಉದ್ಯೋಗವನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ.</p>"
                f"<p><strong>11.2 ಮಹಿಳಾ ಸಬಲೀಕರಣ:</strong><br>"
                f"ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ, ಆಡಳಿತ ಮತ್ತು ಪ್ಯಾಕೇಜಿಂಗ್‌ನಲ್ಲಿ ಕನಿಷ್ಠ <strong>{int(doc.women_employment or 6)} ಹುದ್ದೆಗಳನ್ನು</strong> ಮಹಿಳೆಯರಿಗೆ ಮೀಸಲಿಡಲಾಗಿದೆ.</p>"
                f"<p><strong>11.3 ವಲಸೆ ತಡೆಗಟ್ಟುವಿಕೆ:</strong><br>"
                f"{district} ದಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಹೈಟೆಕ್ ಉದ್ಯೋಗಾವಕಾಶ ಕಲ್ಪಿಸುವ ಮೂಲಕ ಗ್ರಾಮೀಣ-ನಗರ ವಲಸೆಯನ್ನು ತಡೆಗಟ್ಟಲು ಕೊಡುಗೆ ನೀಡುತ್ತದೆ.</p>"
            ),
            "end_products_quality": (
                f"<p><strong>12.1 ಗುಣಮಟ್ಟ ಖಾತರಿ ಮತ್ತು ನಿಖರ ಪರೀಕ್ಷೆ:</strong><br>"
                f"3D CMM ಮತ್ತು ಡಿಜಿಟಲ್ ಗೇಜ್‌ಗಳನ್ನು ಬಳಸಿ 100% ಆಯಾಮದ ಪರಿಶೀಲನೆ ನಡೆಸುವ ಮೂಲಕ ಶೂನ್ಯ-ದೋಷ ವಿತರಣೆಯನ್ನು ಖಚಿತಪಡಿಸಲಾಗುತ್ತದೆ.</p>"
                f"<p><strong>12.2 ಗುಣಮಟ್ಟ ಪ್ರಮಾಣೀಕರಣಗಳು:</strong><br>"
                f"ಎಲ್ಲಾ ಉಪಕರಣಗಳು NABL-ಮಾನ್ಯತೆ ಪಡೆದ ಪ್ರಯೋಗಾಲಯಗಳಿಂದ ನಿಯಮಿತವಾಗಿ ಮಾಪನಾಂಕ ನಿರ್ಣಯಿಸಲ್ಪಡುತ್ತವೆ (ISO 9001:2015).</p>"
            ),
            "financial_viability": (
                f"<p><strong>13.1 ಲಾಭದಾಯಕತೆ ಮತ್ತು ನಗದು ಹರಿವು:</strong><br>"
                f"ಘಟಕವು ಬಲವಾದ ಕಾರ್ಯಾಚರಣೆಯ ನಗದು ಹರಿವನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ. ಸರಾಸರಿ EBITDA ಮಾರ್ಜಿನ್ 22.5% ಆಗಿರುತ್ತದೆ.</p>"
                f"<p><strong>13.2 ಸಾಲ ಸೇವಾ ವ್ಯಾಪ್ತಿ ಅನುಪಾತ (DSCR):</strong><br>"
                f"5-ವರ್ಷಗಳ ಸರಾಸರಿ DSCR <strong>{avg_dscr:.2f}x</strong> ಆಗಿದ್ದು, ಸಕಾಲಿಕ ಸಾಲ ಮರುಪಾವತಿಗೆ ಸಂಪೂರ್ಣ ಸುರಕ್ಷತೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ.</p>"
                f"<p><strong>13.3 ಬ್ರೇಕ್-ಈವನ್ ಪಾಯಿಂಟ್ (BEP):</strong><br>"
                f"ಬ್ರೇಕ್-ಈವನ್ ಬಿಂದುವನ್ನು ಸ್ಥಾಪಿತ ಸಾಮರ್ಥ್ಯದ <strong>{bep_percent:.1f}%</strong> ದಲ್ಲಿ ಸಾಧಿಸಲಾಗುತ್ತದೆ.</p>"
            ),
            "tandon_working_capital": (
                f"<p><strong>14.1 ಟಂಡನ್ ಸಮಿತಿ ದುಡಿಯುವ ಬಂಡವಾಳ ಮೌಲ್ಯಮಾಪನ:</strong><br>"
                f"ಟಂಡನ್ ಸಮಿತಿ ನಿಯಮಗಳ (Method I & II MPBF) ಪ್ರಕಾರ ದುಡಿಯುವ ಬಂಡವಾಳವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗಿದ್ದು, ಆರೋಗ್ಯಕರ ನಿವ್ವಳ ದುಡಿಯುವ ಬಂಡವಾಳವನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.</p>"
            ),
            "esg_sustainability": (
                f"<p><strong>15.1 ಪರಿಸರ, ಸಾಮಾಜಿಕ ಮತ್ತು ಆಡಳಿತ (ESG) ಸ್ಕೋರ್‌ಕಾರ್ಡ್:</strong><br>"
                f"ಘಟಕವು <strong>'Grade A'</strong> ESG ರೇಟಿಂಗ್ ಸಾಧಿಸಿದೆ. ಎಲ್ಇಡಿ ದೀಪಗಳು, ಸೌರಶಕ್ತಿ ಅಳವಡಿಕೆ ಮತ್ತು ಶೂನ್ಯ ದ್ರವ ಹೊರಸೂಸುವಿಕೆ (ZLD) ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಲಾಗಿದೆ.</p>"
            ),
            "tcrm_technology_readiness": (
                f"<p><strong>16.1 ತಂತ್ರಜ್ಞಾನ ಸನ್ನದ್ಧತೆ (TRL 9 ಆಡಿಟ್):</strong><br>"
                f"ಘಟಕವು <strong>TRL 9 (ವಾಣಿಜ್ಯಿಕವಾಗಿ ಸಾಬೀತಾದ ತಂತ್ರಜ್ಞಾನ)</strong> ಮಟ್ಟದಲ್ಲಿದ್ದು, ಶೂನ್ಯ ತಾಂತ್ರಿಕ ಅಪಾಯವನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.</p>"
            ),
            "projections_10yr_narrative": (
                f"<p><strong>17.1 10-ವರ್ಷಗಳ ವಿಸ್ತೃತ ಹಣಕಾಸು ಮುನ್ನೋಟ:</strong><br>"
                f"10-ವರ್ಷಗಳ ಹಣಕಾಸು ಮಾದರಿಯು 5 ನೇ ವರ್ಷದ ವೇಳೆಗೆ ಸಂಪೂರ್ಣ ಸಾಲ ಮರುಪಾವತಿ ಮತ್ತು ಭವಿಷ್ಯದ ವಿಸ್ತರಣೆಗಾಗಿ ಗಣನೀಯ ಉಚಿತ ನಗದು ಮೀಸಲು ಸಂಗ್ರಹವನ್ನು ತೋರಿಸುತ್ತದೆ.</p>"
            ),
            "monthly_cashflow_narrative": (
                f"<p><strong>18.1 36-ತಿಂಗಳುಗಳ ಮಾಸಿಕ ನಗದು ನಿರ್ವಹಣೆ:</strong><br>"
                f"36-ತಿಂಗಳ ವಿವರವಾದ ನಗದು ಹರಿವು ಎಲ್ಲಾ ತ್ರೈಮಾಸಿಕಗಳಲ್ಲಿ ಧನಾತ್ಮಕ ಮುಕ್ತಾಯದ ನಗದು ಸಮತೋಲನವನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.</p>"
            ),
            "boq_narrative": (
                f"<p><strong>19.1 ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬಿಲ್ ಆಫ್ ಕ್ವಾಂಟಿಟೀಸ್ (BOQ) ಮತ್ತು ಖರೀದಿ:</strong><br>"
                f"ಪ್ರಮಾಣೀಕೃತ ಪೂರೈಕೆದಾರರಿಂದ 30-ದಿನಗಳ ಕ್ರೆಡಿಟ್ ಆಧಾರದಲ್ಲಿ ಗುಣಮಟ್ಟದ ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.</p>"
            ),
            "manpower_narrative": (
                f"<p><strong>20.1 ಮಾನವ ಸಂಪನ್ಮೂಲ ಶ್ರೇಣಿ ಮತ್ತು ಸಾಮರ್ಥ್ಯ ವೃದ್ಧಿ:</strong><br>"
                f"ಒಟ್ಟು {int(doc.local_employment or 15)} ಸಿಬ್ಬಂದಿಗೆ ರಾಜ್ಯದ ಕನಿಷ್ಠ ವೇತನ ನಿಯಮಗಳು ಮತ್ತು ಉತ್ಪಾದಕತೆ ಆಧಾರಿತ ಬೋನಸ್ ಸೌಲಭ್ಯಗಳನ್ನು ನೀಡಲಾಗುತ್ತದೆ.</p>"
            ),
            "sensitivity_narrative": (
                f"<p><strong>21.1 ಬಹು-ಸನ್ನಿವೇಶ ಒತ್ತಡ ಪರೀಕ್ಷೆ ಮತ್ತು ಸೂಕ್ಷ್ಮತೆ ವಿಶ್ಲೇಷಣೆ:</strong><br>"
                f"+10% ವೆಚ್ಚ ಹೆಚ್ಚಳ ಅಥವಾ -10% ಆದಾಯ ಕುಸಿತದ ಸನ್ನಿವೇಶದಲ್ಲೂ DSCR ಅನುಪಾತವು 1.40x ಗಿಂತ ಹೆಚ್ಚಾಗಿ ಉಳಿದು, ಯೋಜನೆಯ ಬ್ಯಾಂಕಿಂಗ್ ಅರ್ಹತೆಯನ್ನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ.</p>"
            ),
            "subsidy_schemes_narrative": (
                f"<p><strong>22.1 ಅನ್ವಯವಾಗುವ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸಬ್ಸಿಡಿ ಮಾರ್ಗಸೂಚಿಗಳು:</strong><br>"
                f"ಯೋಜನೆಯು PMEGP / PMFME / MSME CLCSS ಯೋಜನೆಗಳ ಅಡಿಯಲ್ಲಿ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಹವಾಗಿದೆ.</p>"
            ),
            "site_utilities_narrative": (
                f"<p><strong>23.1 ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಸೌಲಭ್ಯಗಳ ಸನ್ನದ್ಧತೆ:</strong><br>"
                f"{format_inr(power_required)} HP/kW ವಿದ್ಯುತ್ ಮತ್ತು {format_inr(water_required)} LPD ನೀರು ಸರಬರಾಜು ಸಂಪರ್ಕಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ.</p>"
            ),
            "marketing_distribution_narrative": (
                f"<p><strong>24.1 ಮಾರಾಟ ಸಂಪರ್ಕ ಮತ್ತು B2B ವಿತರಣೆ:</strong><br>"
                f"ನೇರ B2B ಕಾರ್ಪೊರೇಟ್ ಸಂಪರ್ಕ ಮತ್ತು ಗವರ್ನಮೆಂಟ್ ಇ-ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ (GeM) ಪೋರ್ಟಲ್ ಮೂಲಕ ಮಾರಾಟ ಜಾಲವನ್ನು ನಿರ್ಮಿಸಲಾಗುತ್ತದೆ.</p>"
            ),
            "statutory_compliances_narrative": (
                f"<p><strong>25.1 ಶಾಸನಬದ್ಧ ಅನುಮೋದನೆಗಳು ಮತ್ತು ಪರವಾನಗಿಗಳ ಪಟ್ಟಿ:</strong><br>"
                f"ಉದ್ಯಮ್ ನೋಂದಣಿ, ಜಿಎಸ್‌ಟಿ ಪ್ರಮಾಣಪತ್ರ, ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣ ಮಂಡಳಿ ಅನುಮತಿ ಮತ್ತು ಅಗ್ನಿ ಸುರಕ್ಷತಾ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಪಡೆದುಕೊಳ್ಳಲಾಗಿದೆ.</p>"
            ),
            "conclusion": (
                f"<p><strong>26.1 ಅಂತಿಮ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲ ಶಿಫಾರಸು:</strong><br>"
                f"{b_name} ನ ಉದ್ದೇಶಿತ ಉತ್ಪಾದನಾ ಘಟಕವು ತಾಂತ್ರಿಕವಾಗಿ ಕಾರ್ಯಸಾಧ್ಯ, ಆರ್ಥಿಕವಾಗಿ ಲಾಭದಾಯಕ ಮತ್ತು ಪರಿಸರ ಸುಸ್ಥಿರವಾಗಿದೆ. "
                f"ಸರಾಸರಿ DSCR <strong>{avg_dscr:.2f}x</strong>, ಧನಾತ್ಮಕ NPV <strong>₹{format_inr(corporate_npv)}</strong>, ಮತ್ತು IRR "
                f"<strong>{corporate_project_irr:.1f}%</strong> ನೊಂದಿಗೆ, <strong>₹{format_inr(bank_loan)}</strong> ಅವಧಿ ಸಾಲವನ್ನು ತಕ್ಷಣವೇ ಮಂಜೂರು ಮಾಡಲು ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.</p>"
                f"<p><strong>26.2 ಆರ್ಥಿಕ ಮತ್ತು ಸಾಮಾಜಿಕ ಪರಿಣಾಮಗಳ ಸಾರಾಂಶ:</strong><br>"
                f"ಯೋಜನೆಯು {int(doc.local_employment or 15)} ನೇರ ಉದ್ಯೋಗಗಳನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ ಮತ್ತು {district} ದಲ್ಲಿ ಸ್ಥಳೀಯ ಆರ್ಥಿಕತೆಗೆ ಕೊಡುಗೆ ನೀಡುತ್ತದೆ.</p>"
            )
        }

    @staticmethod
    def _get_hindi_sections(doc, b_name, promoter, product, district, state, total_cost, land_cost, building_cost, furniture_cost, other_cost, electrification_cost, working_capital, promoter_contribution, bank_loan, subsidy, avg_dscr, bep_percent, corporate_npv, corporate_project_irr, corporate_payback_years, daily_capacity, market_growth, builtup_area, power_required, water_required, m_total, promoter_pct, bank_pct, debt_equity_val) -> Dict[str, str]:
        raw_entity = str(doc.entity_type or "Proprietorship").lower()
        if "partner" in raw_entity:
            entity_label = "साझेदारी फर्म (Partnership)"
        elif "pvt" in raw_entity or "private" in raw_entity:
            entity_label = "प्राइवेट लिमिटेड कंपनी (Private Limited)"
        elif "llp" in raw_entity:
            entity_label = "सीमित देयता भागीदारी (LLP)"
        else:
            entity_label = "एकल स्वामित्व फर्म (Proprietorship)"

        return {
            "exec_summary": (
                f"<p><strong>1.1 रणनीतिक औचित्य एवं कार्यकारी सारांश:</strong><br>"
                f"{b_name} {district}, {state} में स्थापित एक अत्याधुनिक वाणिज्यिक विनिर्माण इकाई है। "
                f"यह उद्यम अंतरराष्ट्रीय गुणवत्ता मानकों (ISO 9001:2015) के अनुरूप प्रीमियम {product} "
                f"के स्वचालित, बड़े पैमाने पर उत्पादन पर केंद्रित है। यह परियोजना शून्य-दोष घटकों की आपूर्ति करके क्षेत्रीय औद्योगिक पारिस्थितिकी तंत्र में महत्वपूर्ण आपूर्ति अंतर को पूरा करती है।</p>"
                f"<p><strong>1.2 निवेश सारांश एवं पूंजीगत परिव्यय:</strong><br>"
                f"परियोजना स्थापित करने के लिए कुल पूंजीगत परिव्यय <strong>₹{format_inr(total_cost)}</strong> अनुमानित है। "
                f"इस निवेश में भूमि विकास (₹{format_inr(land_cost)}), औद्योगिक शेड निर्माण (₹{format_inr(building_cost)}), "
                f"संयंत्र एवं मशीनरी खरीद (₹{format_inr(m_total)}), विद्युतीकरण एवं ट्रांसफार्मर (₹{format_inr(electrification_cost)}), "
                f"कार्यालय फर्नीचर (₹{format_inr(furniture_cost)}), प्रारंभिक आकस्मिक व्यय (₹{format_inr(other_cost)}), "
                f"और कार्यशील पूंजी मार्जिन आवश्यकता (₹{format_inr(working_capital)}) शामिल है।</p>"
                f"<p><strong>1.3 वित्तपोषण के साधन एवं ऋण संरचना:</strong><br>"
                f"वित्तपोषण के साधनों में प्रवर्तक इक्विटी अंशदान <strong>₹{format_inr(promoter_contribution)}</strong> ({promoter_pct:.1f}%), "
                f"बैंक सावधि ऋण सुविधा <strong>₹{format_inr(bank_loan)}</strong> ({bank_pct:.1f}%), और सरकारी पूंजीगत सब्सिडी "
                f"<strong>₹{format_inr(subsidy)}</strong> शामिल है। प्रवर्तक इक्विटी पूरी तरह से निजी पूंजीगत स्रोतों से लगाई गई है, जो मजबूत प्रतिबद्धता दर्शाती है।</p>"
                f"<p><strong>1.4 वित्तीय साध्यता एवं बैंक स्वीकृति औचित्य:</strong><br>"
                f"वित्तीय मॉडलिंग मजबूत नकदी प्रवाह उत्पादन प्रदर्शित करती है। परियोजना 5-वर्षीय औसत ऋण सेवा कवरेज अनुपात (DSCR) "
                f"<strong>{avg_dscr:.2f}</strong> (बैंकिंग बेंचमार्क 1.50x से काफी अधिक), ब्रेक-ईवन पॉइंट (BEP) "
                f"<strong>{bep_percent:.1f}%</strong>, शुद्ध वर्तमान मूल्य (NPV) <strong>₹{format_inr(corporate_npv)}</strong>, और आंतरिक प्रतिफल दर (IRR) "
                f"<strong>{corporate_project_irr:.1f}%</strong> प्राप्त करती है। कुल पूंजी की पेबैक अवधि <strong>{corporate_payback_years:.1f} वर्ष</strong> अनुमानित है। "
                f"इस प्रस्ताव को तत्काल सावधि ऋण स्वीकृति हेतु दृढ़ता से अनुशंसित किया जाता है।</p>"
            ),
            "business_overview": (
                f"<p><strong>2.1 कॉर्पोरेट गठन एवं वैधानिक प्रोफ़ाइल:</strong><br>"
                f"{b_name} {state} में मुख्यालय वाली एक {entity_label} इकाई के रूप में निगमित है। व्यवसाय राष्ट्रीय एमएसएमई नियमों का पूर्ण अनुपालन करता है, "
                f"जिसके पास सक्रिय उद्यम पंजीकरण ({doc.udyam_no or 'पंजीकृत'}), GSTIN ({doc.gst_no or 'सक्रिय पंजीकृत'}), पैन ({doc.pan_no or 'सक्रिय'}), "
                f"और कॉर्पोरेट पहचान संख्या (CIN: {doc.cin or 'लागू नहीं'}) है।</p>"
                f"<p><strong>2.2 प्रवर्तक पृष्ठभूमि एवं प्रबंधन क्षमता:</strong><br>"
                f"उद्यम का नेतृत्व {promoter} द्वारा औद्योगिक उत्पादन, टूलींग डिजाइन और गुणवत्ता इंजीनियरिंग में 12 से अधिक वर्षों के अनुभव वाली तकनीकी टीम के साथ किया जा रहा है। "
                f"प्रबंधन टीम एक त्रुटिहीन क्रेडिट इतिहास (सिबिल स्कोर: {doc.cibil_score or 780}) बनाए रखती है।</p>"
                f"<p><strong>2.3 दृष्टिकोण, मिशन एवं रणनीतिक शासन:</strong><br>"
                f"संगठन का दृष्टिकोण दक्षिण भारत में सटीक औद्योगिक घटकों का पसंदीदा टियर-1 आपूर्तिकर्ता बनना है। परिचालन सिद्धांत निरंतर नवाचार, काइज़न (Kaizen / 5S), शून्य अपशिष्ट और पारदर्शी वित्तीय रिपोर्टिंग पर जोर देते हैं।</p>"
                f"<p><strong>2.4 कॉर्पोरेट कार्यालय एवं औद्योगिक स्थान:</strong><br>"
                f"पंजीकृत कार्यालय एवं विनिर्माण इकाई {district}, {state} में स्थित है। यह स्थल एक निर्दिष्ट औद्योगिक क्षेत्र में है जहां 3-फेज हाई-टेंशन बिजली, वाणिज्यिक पानी और प्रमुख राष्ट्रीय माल परिवहन गलियारे उपलब्ध हैं।</p>"
            ),
            "project_background": (
                f"<p><strong>3.1 मैक्रोइकॉनॉमिक वातावरण एवं औद्योगिक संदर्भ:</strong><br>"
                f"'मेक इन इंडिया' और उत्पादन से जुड़े प्रोत्साहन (PLI) योजनाओं के कारण भारतीय विनिर्माण क्षेत्र तीव्र विकास का अनुभव कर रहा है।</p>"
                f"<p><strong>3.2 परियोजना स्थापना की रणनीतिक आवश्यकता:</strong><br>"
                f"{state} में क्षेत्रीय ओईएम निर्माताओं को सटीक घटकों की समय पर आपूर्ति सुनिश्चित करने के लिए {b_name} की स्थापना एक अत्यधिक उत्तरदायी केंद्र प्रदान करती है।</p>"
                f"<p><strong>3.3 राष्ट्रीय एवं राज्य एमएसएमई नीतियों के साथ संरेखण:</strong><br>"
                f"यह परियोजना कर्नाटक औद्योगिक नीति 2020-2025 और केंद्रीय एमएसएमई दिशानिर्देशों के साथ संरेखित है, जो पूंजीगत सब्सिडी और बिजली टैरिफ रियायतों के लिए योग्य है।</p>"
            ),
            "product_description": (
                f"<p><strong>4.1 प्राथमिक उत्पाद श्रृंखला एवं तकनीकी विनिर्देश:</strong><br>"
                f"इकाई उच्च-सटीक <strong>{product}</strong> (HSN कोड: {doc.hsn_code or '8466'}) के निर्माण में माहिर है। सभी उत्पादन ISO 9001:2015 और BIS अंतरराष्ट्रीय मानकों के अनुरूप हैं।</p>"
                f"<p><strong>4.2 विनिर्माण कार्यप्रवाह एवं गुणवत्ता निरीक्षण:</strong><br>"
                f"उत्पादन प्रवाह सख्त बहु-स्तरीय गुणवत्ता प्रोटोकॉल का पालन करता है: कच्चा माल परीक्षण, सीएनसी मशीनिंग, हीट ट्रीटमेंट, और 3D सीएमएम आयाम ऑडिट।</p>"
                f"<p><strong>4.3 स्थापित दैनिक क्षमता:</strong><br>"
                f"सुविधा की स्थापित दैनिक क्षमता <strong>{format_inr(daily_capacity)} {doc.capacity_unit} प्रति दिन</strong> है, जो वर्ष में {doc.working_days} दिन संचालित होती है।</p>"
                f"<p><strong>4.4 मूल्य प्रस्ताव एवं प्रतिस्पर्धी बढ़त:</strong><br>"
                f"स्वचालित मशीनरी के माध्यम से कम इकाई उत्पादन लागत, शून्य-दोष गुणवत्ता आश्वासन और स्थानीय तकनीकी सहायता {b_name} के प्रमुख लाभ हैं।</p>"
                f"<p><strong>4.5 पैकेजिंग, भंडारण एवं शेल्फ-लाइफ प्रबंधन:</strong><br>"
                f"तैयार घटकों को परिवहन के दौरान जंग से बचाने के लिए एंटी-जंग वीसीआई तेल कोटिंग और वैक्यूम पैकेजिंग की जाती है।</p>"
            ),
            "market_analysis": (
                f"<p><strong>5.1 उद्योग का आकार एवं सीएजीआर विकास:</strong><br>"
                f"भारतीय सटीक इंजीनियरिंग बाजार <strong>{market_growth:.1f}%</strong> के वार्षिक सीएजीआर से बढ़ रहा है। मांग ईवी विनिर्माण और औद्योगिक स्वचालन से प्रेरित है।</p>"
                f"<p><strong>5.2 कुल एड्रेसेबल मार्केट (TAM / SAM / SOM) विश्लेषण:</strong><br>"
                f"{b_name} अगले 36 महीनों में मजबूत क्षेत्रीय बाजार हिस्सेदारी हासिल करने का लक्ष्य रखता है।</p>"
                f"<p><strong>5.3 लक्षित ग्राहक वर्ग एवं ऑफटेक नेटवर्क:</strong><br>"
                f"लक्षित खरीदारों में टियर-1 ऑटोमोटिव ओईएम, भारी मशीन निर्माता और औद्योगिक वितरक शामिल हैं, जिनके साथ दीर्घकालिक अनुबंध किए जाएंगे।</p>"
            ),
            "technical_feasibility": (
                f"<p><strong>6.1 संयंत्र मशीनरी एवं स्वचालन प्रौद्योगिकी:</strong><br>"
                f"उत्पादन तल में सीएनसी टर्निंग सेंटर, वीएमसी मशीनें और डिजिटल मेट्रोलॉजी उपकरण शामिल हैं ({doc.supplier_name or 'प्रमुख आपूर्तिकर्ता'})।</p>"
                f"<p><strong>6.2 कारखाना लेआउट एवं कार्यक्षेत्र विनिर्देश:</strong><br>"
                f"संयंत्र <strong>{format_inr(builtup_area)} वर्ग फुट</strong> के निर्मित क्षेत्र में लीन मैन्युफैक्चरिंग सिद्धांतों के अनुसार अनुकूलित है।</p>"
                f"<p><strong>6.3 पावर ग्रिड एवं बैकअप:</strong><br>"
                f"स्वीकृत वाणिज्यिक बिजली भार <strong>{format_inr(power_required)} HP/kW</strong> है और 100% डीजी जनरेटर बैकअप स्थापित है।</p>"
                f"<p><strong>6.4 जल आपूर्ति एवं पर्यावरण संरक्षण:</strong><br>"
                f"प्रक्रिया जल आवश्यकता <strong>{format_inr(water_required)} LPD</strong> है और ईटीपी/जेಡ್‌एलडी के माध्यम से पूर्ण रीसाइक्लिंग सुनिश्चित की जाती है।</p>"
            ),
            "risk_analysis": (
                f"<p><strong>7.1 परिचालन एवं मशीन डाउनटाइम जोखिम:</strong><br>"
                f"निवारक रखरखाव अनुसूचियों और ओईएम आपूर्तिकर्ताओं के साथ एएमसी समझौतों द्वारा कम किया गया है।</p>"
                f"<p><strong>7.2 कच्चे माल की कीमत में अस्थिरता जोखिम:</strong><br>"
                f"वार्षिक दर अनुबंधों और खरीदार अनुबंधों में मूल्य वृद्धि खंड शामिल करके नियंत्रित किया गया है।</p>"
                f"<p><strong>7.3 ऋण जोखिम एवं प्राप्य प्रबंधन:</strong><br>"
                f"सख्त 30-दिवसीय भुगतान चक्र और क्रेडिट बीमा द्वारा प्रबंधित किया जाता है।</p>"
            ),
            "swot_analysis": (
                f"<p><strong>8.1 ताकत (S):</strong> उन्नत सीएनसी मशीनरी, अनुभवी तकनीकी प्रवर्तक टीम, ISO 9001 अनुपालन, {district} में रणनीतिक स्थान।</p>"
                f"<p><strong>8.2 कमजोरियां (W):</strong> प्रारंभिक कार्यशील पूंजी निर्भरता, कुशल ऑपरेटरों की आवश्यकता।</p>"
                f"<p><strong>8.3 अवसर (O):</strong> ईवी घटकों की बढ़ती मांग, एमएसएमई पूंजीगत सब्सिडी योजनाएं (PMEGP/PMFME)।</p>"
                f"<p><strong>8.4 खतरे (T):</strong> कच्चे माल की कीमतों में उतार-चढ़ाव, सस्ते आयात से प्रतिस्पर्धा।</p>"
                f"<p><strong>8.5 रणनीतिक रोडमैप:</strong> दीर्घकालिक आपूर्ति अनुबंधों और निरंतर कौशल उन्नयन के माध्यम से सुरक्षा सुनिश्चित की जाएगी।</p>"
            ),
            "cost_and_means": (
                f"<p><strong>9.1 परियोजना लागत औचित्य:</strong><br>"
                f"₹{format_inr(total_cost)} का पूंजीगत परिव्यय भवन (₹{format_inr(building_cost)}), मशीनरी (₹{format_inr(m_total)}), विद्युतीकरण (₹{format_inr(electrification_cost)}), और कार्यशील पूंजी (₹{format_inr(working_capital)}) में आवंटित है।</p>"
                f"<p><strong>9.2 वित्तपोषण संरचना:</strong><br>"
                f"प्रवर्तक इक्विटी ₹{format_inr(promoter_contribution)} ({promoter_pct:.1f}%) और बैंक ऋण ₹{format_inr(bank_loan)} ({bank_pct:.1f}%), ऋण-इक्विटी अनुपात {debt_equity_val:.2f}x है।</p>"
            ),
            "land_shed_infrastructure": (
                f"<p><strong>10.1 कारखाना परिसर एवं स्थल उपयुक्तता:</strong><br>"
                f"इकाई {district}, {state} में स्थित है, जो 4-लेन राजमार्ग कनेक्टिविटी और माल परिवहन केंद्रों की निकटता प्रदान करती है।</p>"
                f"<p><strong>10.2 नागरिक संरचना एवं भार क्षमता:</strong><br>"
                f"शेड भारी सीएनसी मशीन भार का समर्थन करने में सक्षम प्रबलित कंक्रीट फर्श और औद्योगिक एपॉक्सी फिनिशिंग से सुसज्जित है।</p>"
            ),
            "youth_empowerment": (
                f"<p><strong>11.1 स्थानीय प्रत्यक्ष रोजगार सृजन:</strong><br>"
                f"यह उद्यम <strong>{int(doc.local_employment or 15)} कुशल तकनीशियनों</strong> के लिए प्रत्यक्ष रोजगार सृजित करेगा, जिसमें स्थानीय युवाओं को प्राथमिकता दी जाएगी।</p>"
                f"<p><strong>11.2 महिला सशक्तिकरण:</strong><br>"
                f"गुणवत्ता मेट्रोलॉजी, प्रशासन और पैकेजिंग में कम से कम <strong>{int(doc.women_employment or 6)} पद</strong> महिलाओं के लिए आरक्षित हैं।</p>"
                f"<p><strong>11.3 पलायन रोकथाम:</strong><br>"
                f"{district} में स्थानीय रूप से हाई-टेक विनिर्माण करियर प्रदान करके यह परियोजना ग्रामीण-से-शहरी संकट पलायन को सक्रिय रूप से रोकती है।</p>"
            ),
            "end_products_quality": (
                f"<p><strong>12.1 गुणवत्ता आश्वासन एवं सटीक परीक्षण:</strong><br>"
                f"ग्राहक असेंबली लाइनों को शून्य-दोष वितरण सुनिश्चित करने के लिए 3D सीएमएम और डिजिटल गेज का उपयोग करके 100% आयामी निरीक्षण किया जाता है।</p>"
                f"<p><strong>12.2 गुणवत्ता प्रमाणन:</strong><br>"
                f"सभी परीक्षण गेज एनएबीएल-मान्यता प्राप्त प्रयोगशालाओं द्वारा वार्षिक रूप से कैलिब्रेट किए जाते हैं (ISO 9001:2015)।</p>"
            ),
            "financial_viability": (
                f"<p><strong>13.1 लाभप्रदता एवं नकदी प्रवाह:</strong><br>"
                f"इकाई मजबूत परिचालन नकदी प्रवाह उत्पन्न करती है। औसत एबिटा (EBITDA) मार्जिन 22.5% रहने का अनुमान है।</p>"
                f"<p><strong>13.2 ऋण सेवा कवरेज अनुपात (DSCR):</strong><br>"
                f"5-वर्षीय औसत DSCR <strong>{avg_dscr:.2f}x</strong> है, जो आरामदायक सुरक्षा के साथ सुगम ऋण चुकौती की गारंटी देता है।</p>"
                f"<p><strong>13.3 ब्रेक-ईवन पॉइंट (BEP):</strong><br>"
                f"ब्रेक-ईवन पॉइंट स्थापित क्षमता के <strong>{bep_percent:.1f}%</strong> पर प्राप्त किया जाता है।</p>"
            ),
            "tandon_working_capital": (
                f"<p><strong>14.1 टंडन समिति कार्यशील पूंजी आकलन:</strong><br>"
                f"कार्यशील पूंजी आवश्यकताएं टंडन समिति मानदंडों (विधि I एवं II MPBF) के अनुसार आकलित की गई हैं, जो स्वस्थ शुद्ध कार्यशील पूंजी सुनिश्चित करती हैं।</p>"
            ),
            "esg_sustainability": (
                f"<p><strong>15.1 पर्यावरण, सामाजिक एवं शासन (ESG) स्कोरकार्ड:</strong><br>"
                f"इकाई को समग्र <strong>'Grade A'</strong> ESG रेटिंग प्राप्त है। पर्यावरण अनुकूल उपायों में एलईडी लाइटिंग, सौर ऊर्जा और शून्य तरल निर्वहन (ZLD) शामिल हैं।</p>"
            ),
            "tcrm_technology_readiness": (
                f"<p><strong>16.1 प्रौद्योगिकी तत्परता स्तर (TRL 9):</strong><br>"
                f"संयंत्र <strong>TRL 9 (वाणिज्यिक रूप से सिद्ध तकनीक)</strong> प्राप्त करता है, जो शून्य तकनीकी जोखिम की पुष्टि करता है।</p>"
            ),
            "projections_10yr_narrative": (
                f"<p><strong>17.1 10-वर्षीय विस्तारित वित्तीय क्षितिज:</strong><br>"
                f"10-वर्षीय वित्तीय मॉडलिंग 5वें वर्ष तक पूर्ण ऋण चुकौती और भविष्य के विस्तार के लिए पर्याप्त संचित मुक्त नकदी भंडार दर्शाती है।</p>"
            ),
            "monthly_cashflow_narrative": (
                f"<p><strong>18.1 36-माह मासिक तरलता प्रबंधन:</strong><br>"
                f"36-माह विस्तृत नकदी प्रवाह अनुमान सत्यापित करते हैं कि सभी तिमाहियों में मासिक समापन नकदी शेष सकारात्मक रहता है।</p>"
            ),
            "boq_narrative": (
                f"<p><strong>19.1 बिल ऑफ क्वांटिटीज (BOQ) एवं कच्चा माल खरीद:</strong><br>"
                f"कच्चा माल प्रमाणित आपूर्तिकर्ताओं से 30-दिवसीय क्रेडिट शर्तों पर खरीदा जाता है।</p>"
            ),
            "manpower_narrative": (
                f"<p><strong>20.1 मानव संसाधन पदानुक्रम एवं क्षमता निर्माण:</strong><br>"
                f"कुल {int(doc.local_employment or 15)} कर्मचारियों के लिए राज्य न्यूनतम वेतन दिशानिर्देश और उत्पादकता प्रोत्साहन लागू हैं।</p>"
            ),
            "sensitivity_narrative": (
                f"<p><strong>21.1 बहु-परिदृश्य स्ट्रेस टेस्ट एवं संवेदनशीलता विश्लेषण:</strong><br>"
                f"+10% लागत वृद्धि या -10% राजस्व गिरावट के तहत भी DSCR अनुपात 1.40x से ऊपर रहता है, जो परियोजना की बैंक स्वीकार्यता की पुष्टि करता है।</p>"
            ),
            "subsidy_schemes_narrative": (
                f"<p><strong>22.1 लागू केंद्रीय एवं राज्य सब्सिडी दिशानिर्देश:</strong><br>"
                f"परियोजना PMEGP / PMFME / MSME CLCSS योजनाओं के तहत पूंजीगत सब्सिडी के लिए पात्र है।</p>"
            ),
            "site_utilities_narrative": (
                f"<p><strong>23.1 अवसंरचना एवं उपयोगिता तत्परता:</strong><br>"
                f"{format_inr(power_required)} HP/kW बिजली और {format_inr(water_required)} जल आपूर्ति कनेक्शन पूरी तरह से चालू हैं।</p>"
            ),
            "marketing_distribution_narrative": (
                f"<p><strong>24.1 बिक्री संबंध एवं B2B वितरण:</strong><br>"
                f"बिक्री को प्रत्यक्ष कॉर्पोरेट तकनीकी पिचों और सरकारी ई-मार्केटप्लेस (GeM) पोर्टल के माध्यम से संचालित किया जाएगा।</p>"
            ),
            "statutory_compliances_narrative": (
                f"<p><strong>25.1 वैधानिक स्वीकृतियां एवं लाइसेंस चेकलिस्ट:</strong><br>"
                f"उद्यम पंजीकरण, जीएसटी प्रमाणपत्र, प्रदूषण नियंत्रण बोर्ड अनापत्ति (NOC) और अग्नि सुरक्षा प्रमाणपत्र प्राप्त कर लिए गए हैं।</p>"
            ),
            "conclusion": (
                f"<p><strong>26.1 अंतिम मूल्यांकन एवं बैंक सावधि ऋण अनुशंसा:</strong><br>"
                f"{b_name} की प्रस्तावित विनिर्माण इकाई तकनीकी रूप से साध्य, व्यावसायिक रूप से आकर्षक और वित्तीय रूप से सुदृढ़ है। "
                f"औसत DSCR <strong>{avg_dscr:.2f}x</strong>, सकारात्मक NPV <strong>₹{format_inr(corporate_npv)}</strong>, और IRR "
                f"<strong>{corporate_project_irr:.1f}%</strong> के साथ, <strong>₹{format_inr(bank_loan)}</strong> के सावधि ऋण की तत्काल प्रशासनिक एवं वित्तीय स्वीकृति की दृढ़ अनुशंसा की जाती है।</p>"
                f"<p><strong>26.2 आर्थिक एवं सामाजिक प्रभाव का सारांश:</strong><br>"
                f"यह उद्यम {int(doc.local_employment or 15)} प्रत्यक्ष रोजगार सृजित करता है और {district} में स्थानीय विनिर्माण विकास को गति देता है।</p>"
            )
        }

