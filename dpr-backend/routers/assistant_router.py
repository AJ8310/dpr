from fastapi import APIRouter
from models.assistant_models import ChatMessageRequest, ChatMessageResponse

router = APIRouter(prefix="/api/assistant", tags=["Interactive AI Assistant"])

def generate_intelligent_assistant_reply(message: str, current_section: str = None) -> str:
    msg_lower = message.lower().strip()
    sec_lower = (current_section or "").lower().strip()
    words = set(msg_lower.replace("?", "").replace("!", "").replace(",", "").replace("/", " ").split())

    # =============================================================
    # 1. SUBSIDIES & SCHEMES (PMEGP, PMFME, KARNATAKA STATE, PM-KUSUM, AIF, STAND-UP INDIA, CLCSS)
    # =============================================================
    
    # 1.1 PMEGP Subsidy
    if any(k in msg_lower for k in ["pmegp", "kvic", "margin money subsidy"]):
        return (
            "🏛️ <strong>PMEGP Government Subsidy Overview & Rules:</strong><br><br>"
            "• <strong>Max Project Cost</strong>: Up to <strong>₹50 Lakhs</strong> (Manufacturing) & <strong>₹20 Lakhs</strong> (Service/Business).<br>"
            "• <strong>Rural Location Subsidy</strong>: <strong>35% Grant</strong> for Special Category (Women, SC/ST, OBC, PH, Ex-Servicemen) / <strong>25% Grant</strong> for General Category.<br>"
            "• <strong>Urban Location Subsidy</strong>: <strong>25% Grant</strong> for Special Category / <strong>15% Grant</strong> for General Category.<br>"
            "• <strong>Promoter Margin (Equity)</strong>: 5% of project cost for Special Category / 10% for General Category.<br>"
            "• <strong>EDP Training</strong>: 10-day mandatory EDP training provided prior to subsidy lock-in release (3-year lock-in period)."
        )

    # 1.2 PMFME Food Processing Subsidy
    if any(k in msg_lower for k in ["pmfme", "food processing subsidy", "odop", "one district one product"]):
        return (
            "🍞 <strong>PMFME (PM Formalisation of Micro Food Processing Enterprises):</strong><br><br>"
            "• <strong>Capital Subsidy Rate</strong>: <strong>35% credit-linked subsidy</strong> up to a maximum of <strong>₹10 Lakhs</strong> per unit.<br>"
            "• <strong>Promoter Contribution</strong>: Minimum 10% of total project cost.<br>"
            "• <strong>Group / SHG / FPO Beneficiaries</strong>: 35% capital subsidy with seed capital grant of ₹40,000 per member for working capital.<br>"
            "• <strong>Eligible Activities</strong>: Bakery, Dairy processing, Spice grinding, Flour mill, Fruit juice, Pickles, Oil extraction, etc."
        )

    # 1.3 Karnataka Industrial Policy State Subsidies
    if any(k in msg_lower for k in ["karnataka", "state subsidy", "kadap", "industrial policy", "stamp duty", "electricity duty"]):
        return (
            "🌾 <strong>Karnataka State Industrial Policy Incentives & Subsidies:</strong><br><br>"
            "• <strong>Investment Promotion Subsidy (IPS)</strong>: 20% to 30% subsidy on Fixed Assets Value (VFA) for Micro & Small Enterprises.<br>"
            "• <strong>Stamp Duty Reimbursement</strong>: 100% exemption/reimbursement on land purchase & lease deeds.<br>"
            "• <strong>Electricity Duty Exemption</strong>: 100% exemption on electricity duty for 5 to 7 years.<br>"
            "• <strong>Land Conversion Fee</strong>: 100% reimbursement of agricultural land conversion charges.<br>"
            "• <strong>Anchor Unit & SC/ST Incentives</strong>: Additional 5% capital subsidy for SC/ST & women entrepreneurs."
        )

    # 1.4 PM-KUSUM & Solar Subsidies
    if any(k in msg_lower for k in ["kusum", "solar subsidy", "rooftop solar", "solar pump"]):
        return (
            "☀️ <strong>PM-KUSUM & Solar Power Subsidies:</strong><br><br>"
            "• <strong>Component B (Solar Pumps)</strong>: 30% Central Financial Assistance (CFA) + 30% State Govt Subsidy (Total <strong>60% Subsidy</strong>).<br>"
            "• <strong>Component A & C (Grid Solar)</strong>: Up to 30% capital subsidy for farmers & cooperatives installing up to 2 MW solar plants.<br>"
            "• <strong>Rooftop Commercial Solar</strong>: Accelerated Depreciation (40%) + GST concessional rate benefits."
        )

    # 1.5 Agriculture Infrastructure Fund (AIF)
    if any(k in msg_lower for k in ["aif", "agriculture infrastructure fund", "agri fund", "cold storage subsidy"]):
        return (
            "🌾 <strong>Agriculture Infrastructure Fund (AIF) Scheme:</strong><br><br>"
            "• <strong>Interest Subvention</strong>: <strong>3% p.a. interest rebate</strong> for bank loans up to <strong>₹2 Crores</strong>.<br>"
            "• <strong>Subvention Duration</strong>: Benefit applicable for a maximum period of <strong>7 years</strong>.<br>"
            "• <strong>CGTMSE Coverage</strong>: Government pays credit guarantee fee for loans up to ₹2 Cr.<br>"
            "• <strong>Eligible Projects</strong>: Cold storage, Warehouses, Sorting & Grading units, Primary Processing centers."
        )

    # 1.6 General / Other Subsidies & Schemes Summary
    if any(k in msg_lower for k in ["subsidy", "subsidies", "govt scheme", "government schemes", "incentive"]):
        return (
            "🏛️ <strong>Government Subsidy & Support Schemes Available:</strong><br><br>"
            "1. <strong>PMEGP</strong>: 15% to 35% margin money subsidy up to ₹50 Lakhs project cost.<br>"
            "2. <strong>PMFME</strong>: 35% credit-linked capital subsidy up to ₹10 Lakhs for Food Processing units.<br>"
            "3. <strong>Karnataka Industrial Policy</strong>: 20%-30% IPS subsidy + 100% Stamp Duty exemption.<br>"
            "4. <strong>PM-KUSUM Solar</strong>: Up to 60% subsidy for solar pump & rooftop installations.<br>"
            "5. <strong>Agri Infrastructure Fund (AIF)</strong>: 3% interest subvention up to ₹2 Crores.<br>"
            "6. <strong>CGTMSE</strong>: Collateral-free bank loan guarantee up to ₹5 Crores.<br><br>"
            "<em>Tip: Our DPR engine automatically factors eligible subsidy amounts into your project's Means of Finance!</em>"
        )

    # =============================================================
    # 2. INTEREST RATES & BANK LOAN NORMS
    # =============================================================

    # 2.1 Loan Interest Rates
    if any(k in msg_lower for k in ["interest rate", "rate of interest", "roi", "bank interest", "loan rate"]):
        return (
            "💰 <strong>Bank Loan Interest Rates & Benchmark Norms (2026):</strong><br><br>"
            "• <strong>MUDRA Loans (PMMY)</strong>: <strong>8.50% to 11.50% p.a.</strong> (No collateral required).<br>"
            "• <strong>PSU Bank Term Loans (SBI, Canara, Union)</strong>: <strong>8.75% to 10.75% p.a.</strong><br>"
            "• <strong>Private Bank Term Loans (HDFC, ICICI, Axis)</strong>: <strong>9.50% to 12.50% p.a.</strong><br>"
            "• <strong>Working Capital Cash Credit (CC)</strong>: <strong>9.00% to 12.00% p.a.</strong><br>"
            "• <strong>Interest Subvention</strong>: 2% to 3% interest rebate available under GST MSME / AIF / PMEGP schemes."
        )

    # 2.2 Repayment Tenure & Moratorium
    if any(k in msg_lower for k in ["repayment", "tenure", "moratorium", "grace period", "loan period", "emi"]):
        return (
            "⏳ <strong>Loan Repayment Tenure & Moratorium Period:</strong><br><br>"
            "• <strong>Term Loan Tenure</strong>: Typically <strong>5 to 7 years</strong> (60 to 84 monthly EMIs).<br>"
            "• <strong>Moratorium (Grace Period)</strong>: <strong>6 to 12 months</strong> during project construction/implementation where only interest is payable.<br>"
            "• <strong>Working Capital (CC/OD)</strong>: Annual renewable facility with monthly interest servicing."
        )

    # =============================================================
    # 3. PROMOTER EQUITY %, DEBT-EQUITY RATIO & FINANCIAL RATIOS
    # =============================================================

    # 3.1 Equity / Promoter Contribution Rate
    if any(k in msg_lower for k in ["equity rate", "promoter equity", "promoter contribution", "margin money", "own investment", "my share"]):
        return (
            "💵 <strong>Promoter Equity & Margin Money Requirements:</strong><br><br>"
            "• <strong>Special Category (Women, SC/ST, OBC, PH)</strong>: <strong>5% to 10%</strong> of total project cost.<br>"
            "• <strong>General Category MSME Loans</strong>: <strong>15% to 25%</strong> of total project cost.<br>"
            "• <strong>Large Commercial Projects</strong>: <strong>25% to 33%</strong> promoter equity.<br><br>"
            "<em>Example: For a ₹50 Lakh project, promoter contribution is ₹2.5L–₹5L (Special) or ₹7.5L–₹12.5L (General), with remainder funded via Bank Loan & Subsidy.</em>"
        )

    # 3.2 Debt-Equity Ratio (DER)
    if any(k in msg_lower for k in ["debt equity", "der", "debt-equity ratio", "leverage ratio"]):
        return (
            "⚖️ <strong>Debt-Equity Ratio (DER) Guidelines:</strong><br><br>"
            "• <strong>Formula</strong>: <code>Total Long-Term Debt / Total Promoter Equity</code><br>"
            "• <strong>Ideal Bank Range</strong>: <strong>2.00 : 1 to 3.00 : 1</strong>.<br>"
            "• <strong>Maximum Allowed Limit</strong>: <strong>3.00 : 1</strong> for MSME loans.<br>"
            "• A DER of 2:1 means for every ₹1 of your equity, bank provides ₹2 of loan."
        )

    # 3.3 DSCR (Debt Service Coverage Ratio)
    if any(k in msg_lower for k in ["dscr", "debt service", "coverage ratio"]):
        return (
            "📊 <strong>Debt Service Coverage Ratio (DSCR) Benchmark:</strong><br><br>"
            "• <strong>Formula</strong>: <code>(Net Profit + Interest + Depreciation) / (Interest + Annual Principal Repayment)</code><br>"
            "• <strong>Ideal Bank Range</strong>: <strong>1.50 to 2.00</strong>.<br>"
            "• <strong>Minimum Acceptable Limit</strong>: <strong>1.25</strong>.<br>"
            "• Our DPR engine calculates year-by-year DSCR automatically for bank loan sanction."
        )

    # 3.4 Break-Even Point (BEP) & Ratios (IRR, NPV)
    if any(k in msg_lower for k in ["bep", "break even", "irr", "npv", "financial ratios"]):
        return (
            "📉 <strong>Key Financial Ratios & Benchmarks:</strong><br><br>"
            "• <strong>Break-Even Point (BEP %)</strong>: <strong>40% to 60%</strong> (lower percentage indicates higher safety margin).<br>"
            "• <strong>Internal Rate of Return (IRR)</strong>: Benchmark <strong>15% to 25%</strong> p.a.<br>"
            "• <strong>Net Present Value (NPV)</strong>: Positive value calculated at bank discount rate (10%-12%).<br>"
            "• <strong>Gross Profit Margin</strong>: 20% to 35% depending on sector."
        )

    # =============================================================
    # 4. TYPES OF DPR REPORTS (TYPE DPR)
    # =============================================================
    if any(k in msg_lower for k in ["type dpr", "types of dpr", "dpr types", "dpr report type", "which dpr", "different dpr"]):
        return (
            "📑 <strong>Types of DPR Reports Available on VKF DPR:</strong><br><br>"
            "1. 🏦 <strong>Bank Loan DPR (CMA Format)</strong>: Designed for SBI, Canara, HDFC, ICICI with Credit Monitoring Arrangement (CMA), DSCR, P&L, Balance Sheet, and Debt Amortization.<br>"
            "2. 🏛️ <strong>Government Scheme & Subsidy DPR</strong>: Formatted specifically for KVIC, DIC, PMFME, PMEGP, KADAP, PM-KUSUM.<br>"
            "3. 💳 <strong>MUDRA Loan DPR</strong>: Simplified structure for Shishu (up to ₹50k), Kishore (₹50k-₹5L), and Tarun (₹5L-₹10L).<br>"
            "4. 💼 <strong>Investor Pitch DPR</strong>: Focuses on TAM/SAM/SOM, Unit Economics, CAGR, Runway, and Valuation.<br>"
            "5. 🏭 <strong>Multi-Sector Tailored DPRs</strong>: Pre-configured models for Dairy, Food Processing, Solar Energy, Manufacturing, Textiles, Cold Storage, Services, etc."
        )

    # =============================================================
    # 5. TYPES OF GOVERNMENT SCHEMES SUMMARY
    # =============================================================
    if any(k in msg_lower for k in ["type of govt scheme", "types of govt schemes", "govt schemes", "all schemes", "schemes list"]):
        return (
            "📜 <strong>Complete List of Supported Government Schemes:</strong><br><br>"
            "• <strong>PMEGP</strong>: Up to ₹50 Lakhs project funding with 15%-35% subsidy.<br>"
            "• <strong>PMFME</strong>: 35% subsidy up to ₹10 Lakhs for Micro Food Enterprises.<br>"
            "• <strong>MUDRA (PMMY)</strong>: Collateral-free loan up to ₹10 Lakhs (Shishu, Kishore, Tarun).<br>"
            "• <strong>CGTMSE</strong>: Collateral-free bank credit guarantee up to ₹5 Crores.<br>"
            "• <strong>Agri Infra Fund (AIF)</strong>: 3% interest subvention up to ₹2 Crores.<br>"
            "• <strong>Stand-Up India</strong>: ₹10L to ₹1 Cr for SC/ST & Women entrepreneurs.<br>"
            "• <strong>PM-KUSUM</strong>: 60% combined subsidy for Solar Pumps & Solar Power.<br>"
            "• <strong>Karnataka Industrial Policy</strong>: IPS capital subsidy & 100% stamp duty exemption."
        )

    # =============================================================
    # 6. USER ACCOUNT, LOGIN, PASSWORD & PROFILE QUERIES
    # =============================================================
    if any(k in msg_lower for k in ["password", "profile", "account", "login", "sign in", "sign up", "register", "logout", "my dashboard"]):
        return (
            "👤 <strong>User Account & Profile Help:</strong><br><br>"
            "• <strong>Log In / Sign Up</strong>: Click the <strong>User Profile</strong> icon or 'Create My DPR' at the top navigation bar.<br>"
            "• <strong>Password Reset</strong>: Use the 'Forgot Password' link on the login popup to receive a password reset link.<br>"
            "• <strong>Saved Reports</strong>: Registered users can view, manage, and re-download all past generated DPR reports directly from their user dashboard."
        )

    # =============================================================
    # 7. DOWNLOADING & EXPORTING PDF / DOCX REPORTS
    # =============================================================
    if any(k in msg_lower for k in ["download", "export", "pdf", "docx", "save report", "get report", "print report", "how to get file"]):
        return (
            "📥 <strong>How to Download Your DPR Report:</strong><br><br>"
            "1. Complete the form steps (or click <em>'Load Test Data'</em> to generate an instant report).<br>"
            "2. Navigate to <strong>Step 14 (Summary & Export)</strong> or click the <strong>Generate DPR</strong> button.<br>"
            "3. Click <strong>Download PDF</strong> for a high-definition print-ready report, or <strong>Download DOCX</strong> for an editable Word document.<br>"
            "4. Your file will download directly to your device within 3–5 seconds!"
        )

    # =============================================================
    # 8. EDITING FORM DATA & GOING BACK
    # =============================================================
    if any(k in msg_lower for k in ["edit", "modify", "change", "correct", "wrong input", "go back", "previous step", "update data", "fix input"]):
        return (
            "✏️ <strong>How to Edit Your Entered Information:</strong><br><br>"
            "• You can edit your data at any time by clicking the <strong>'Back'</strong> button at the bottom of the form.<br>"
            "• Alternatively, click on any step number (Steps 1 to 14) in the top <strong>Progress Header Bar</strong> to jump directly to that section.<br>"
            "• All updated values will immediately recalculate your 5-Year financial model and chart preview."
        )

    # =============================================================
    # 9. SAVING FORM PROGRESS & AUTO-SAVE
    # =============================================================
    if any(k in msg_lower for k in ["save progress", "draft", "resume", "auto save", "continue later"]):
        return (
            "💾 <strong>Automatic Form Progress Saving:</strong><br><br>"
            "• Your form progress is <strong>automatically saved</strong> in real-time to your local session.<br>"
            "• You can safely close your browser tab or return later — your filled data will be restored automatically.<br>"
            "• Logged-in users can access saved draft DPRs across any browser or device."
        )

    # =============================================================
    # 10. VKF CO-BRANDING / LOGO CHECKBOX
    # =============================================================
    if any(k in msg_lower for k in ["vkf logo", "partnered with vkf", "associated with vkf", "logo", "branding", "co-branding"]):
        return (
            "🖼️ <strong>Logo & VKF Co-Branding Options:</strong><br><br>"
            "• <strong>Unchecked (Default)</strong>: ONLY your uploaded business logo is displayed on the cover page and headers.<br>"
            "• <strong>Checked ('Associated/Partnered with VKF')</strong>: BOTH your uploaded business logo AND the official VKF logo are displayed side-by-side on the cover page banner and running header.<br>"
            "• You can toggle this checkbox at the bottom of the form inputs before downloading your report!"
        )

    # =============================================================
    # 11. CONTACT SUPPORT, HELPDESK & ADDRESS
    # =============================================================
    if any(k in msg_lower for k in ["contact", "support", "helpdesk", "phone number", "email id", "address", "office location", "customer care"]):
        return (
            "📞 <strong>Vision Karnataka Foundation Support Desk:</strong><br><br>"
            "• <strong>Helpline Phone</strong>: +91 98860 12345 / 080-23456789<br>"
            "• <strong>Email Support</strong>: support@vkf.org / dpr@visionkarnataka.org<br>"
            "• <strong>Office Address</strong>: Vision Karnataka Foundation SME Desk, Bengaluru, Karnataka.<br>"
            "• <strong>Working Hours</strong>: Monday – Saturday (9:30 AM to 6:30 PM IST)."
        )

    # =============================================================
    # 12. GREETINGS & NATURAL CONVERSATIONAL RESPONSES
    # =============================================================
    greeting_terms = {"hey", "hi", "hii", "hiii", "hello", "namaste", "good morning", "good afternoon", "good evening", "greetings"}
    if words.intersection(greeting_terms) or msg_lower in greeting_terms:
        return (
            "👋 <strong>Hello! Welcome to VKF DPR AI Assistant.</strong><br><br>"
            "I am trained with end-to-end knowledge on:<br>"
            "• 🏛️ <strong>Government Subsidies</strong> (PMEGP, PMFME, Karnataka State IPS, Solar, AIF).<br>"
            "• 💰 <strong>Interest Rates & Loan Norms</strong> (MUDRA 8.5%, MSME 8.75%-11.5%, Subventions).<br>"
            "• 💵 <strong>Equity Rates & Ratios</strong> (Promoter 5-15%, Debt-Equity 2:1, DSCR 1.5-2.0x).<br>"
            "• 📑 <strong>DPR Report Types</strong> (Bank Loan CMA, Govt Scheme, MUDRA, Investor Pitch).<br>"
            "• 📥 <strong>Downloading & Editing</strong> (PDF/DOCX exports, auto-save progress).<br><br>"
            "What query can I answer for you today?"
        )

    if any(k in msg_lower for k in ["thank", "thanks", "thankyou", "awesome", "great", "perfect", "good"]):
        return (
            "😊 <strong>You're very welcome!</strong><br><br>"
            "I'm glad I could assist you. If you have any more questions about subsidies, interest rates, financial ratios, or downloading your DPR report, feel free to ask anytime!"
        )

    # =============================================================
    # 13. SMART DIRECT CONVERSATIONAL FALLBACK
    # =============================================================
    sec_str = f" for section <strong>'{current_section}'</strong>" if current_section else ""
    return (
        f"💬 <strong>VKF DPR AI Assistant:</strong><br><br>"
        f"Regarding your query about <em>'{message}'</em>{sec_str}:<br><br>"
        "• 🏛️ <strong>Subsidies & Schemes</strong>: Ask about PMEGP (up to 35%), PMFME (35% up to 10L), Karnataka State IPS, or PM-KUSUM.<br>"
        "• 💰 <strong>Interest & Loan Terms</strong>: Bank rates (8.5%-11.5%), 5-7 year tenure, 6-12 month moratorium.<br>"
        "• 💵 <strong>Equity & Ratios</strong>: Promoter contribution (5-15%), Debt-Equity (2:1 to 3:1), Ideal DSCR (1.5-2.0x).<br>"
        "• 📥 <strong>Downloading Reports</strong>: Go to Step 14 (Summary) and click 'Download PDF' or 'Download DOCX'.<br><br>"
        "Type any specific topic above for instant detailed guidance!"
    )

@router.post("/chat", response_model=ChatMessageResponse)
async def chat_with_assistant(payload: ChatMessageRequest):
    reply_html = generate_intelligent_assistant_reply(payload.message, payload.current_section)
    return ChatMessageResponse(success=True, reply=reply_html)
