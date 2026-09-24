from fastapi import APIRouter
from models.assistant_models import ChatMessageRequest, ChatMessageResponse

router = APIRouter(prefix="/api/assistant", tags=["Interactive AI Assistant"])

def generate_intelligent_assistant_reply(message: str, current_section: str = None) -> str:
    msg_lower = message.lower().strip()
    sec_lower = (current_section or "").lower().strip()
    words = set(msg_lower.replace("?", "").replace("!", "").replace(",", "").split())

    # =============================================================
    # 1. USER ACCOUNT, LOGIN, PASSWORD & PROFILE QUERIES
    # =============================================================
    if any(k in msg_lower for k in ["password", "profile", "account", "login", "sign in", "sign up", "register", "logout", "my dashboard"]):
        return (
            "👤 <strong>User Account & Profile Help:</strong><br><br>"
            "• <strong>Log In / Sign Up</strong>: Click the <strong>User Profile</strong> icon at the top right of the navigation bar.<br>"
            "• <strong>Password Reset</strong>: Use the 'Forgot Password' link on the login popup to receive a password reset link.<br>"
            "• <strong>Saved Reports</strong>: Registered users can view, manage, and re-download all past generated DPR reports directly from their user dashboard."
        )

    # =============================================================
    # 2. DOWNLOADING & EXPORTING PDF / DOCX REPORTS
    # =============================================================
    if any(k in msg_lower for k in ["download", "export", "pdf", "docx", "save report", "get report", "print report", "how to get file"]):
        return (
            "📥 <strong>How to Download Your DPR Report:</strong><br><br>"
            "1. Complete the form steps (or click <em>'Load Test Data'</em> to generate an instant report).<br>"
            "2. Navigate to <strong>Step 14 (Summary & Generate)</strong> or click the <strong>Generate DPR</strong> button.<br>"
            "3. Click <strong>Download PDF</strong> for a high-definition print-ready report, or <strong>Download DOCX</strong> for an editable Word document.<br>"
            "4. Your file will download directly to your device within 3–5 seconds!"
        )

    # =============================================================
    # 3. EDITING FORM DATA & GOING BACK
    # =============================================================
    if any(k in msg_lower for k in ["edit", "modify", "change", "correct", "wrong input", "go back", "previous step", "update data", "fix input"]):
        return (
            "✏️ <strong>How to Edit Your Entered Information:</strong><br><br>"
            "• You can edit your data at any time by clicking the <strong>'Back'</strong> button at the bottom of the form.<br>"
            "• Alternatively, click on any step number (Steps 1 to 14) in the top <strong>Progress Header Bar</strong> to jump directly to that section.<br>"
            "• All updated values will immediately recalculate your 5-Year financial model and chart preview."
        )

    # =============================================================
    # 4. SAVING FORM PROGRESS & AUTO-SAVE
    # =============================================================
    if any(k in msg_lower for k in ["save progress", "draft", "resume", "auto save", "continue later"]):
        return (
            "💾 <strong>Automatic Form Progress Saving:</strong><br><br>"
            "• Your form progress is <strong>automatically saved</strong> in real-time to your local session.<br>"
            "• You can safely close your browser tab or return later — your filled data will be restored automatically.<br>"
            "• Logged-in users can access saved draft DPRs across any browser or device."
        )

    # =============================================================
    # 5. CONTACT SUPPORT, HELPDESK & ADDRESS
    # =============================================================
    if any(k in msg_lower for k in ["contact", "support", "helpdesk", "phone number", "email id", "address", "office location", "customer care"]):
        return (
            "📞 <strong>Vision Karnataka Foundation Support Desk:</strong><br><br>"
            "• <strong>Helpline Phone</strong>: +91 98450 12345 / 080-23456789<br>"
            "• <strong>Email Support</strong>: support@visionkarnataka.org / dpr@visionkarnataka.org<br>"
            "• <strong>Office Address</strong>: Vision Karnataka Foundation SME Desk, Peenya Industrial Area, Bengaluru, Karnataka 560058.<br>"
            "• <strong>Working Hours</strong>: Monday – Saturday (9:30 AM to 6:30 PM IST)."
        )

    # =============================================================
    # 6. PRICING, PAYMENTS & GST INVOICES
    # =============================================================
    if any(k in msg_lower for k in ["pricing", "payment", "razorpay", "invoice", "receipt", "gst invoice", "is it free"]):
        return (
            "💳 <strong>Pricing & Instant Invoice Access:</strong><br><br>"
            "• <strong>Free Live Preview</strong>: Form filling and live financial calculations are 100% free.<br>"
            "• <strong>Bank-Grade DPR Export</strong>: Full 17-section institutional report with 300 DPI multi-color charts, working capital schedules, depreciation tables, and loan amortization.<br>"
            "• <strong>Instant GST Invoice</strong>: An official GST tax invoice is generated automatically upon report download."
        )

    # =============================================================
    # 7. SPECIFIC FORM & SECTION HELP (MACHINERY, HSN, MANPOWER, LAND)
    # =============================================================

    # 7.1 Machinery & Equipment
    if any(k in msg_lower for k in ["machinery", "machine", "equipment", "vendor", "quotation"]):
        return (
            "🏭 <strong>Plant & Machinery Input Guide (Section 5):</strong><br><br>"
            "• Enter each major machine name, unit price (₹), and required quantity.<br>"
            "• <strong>Tip</strong>: Use values from your official GST supplier quotation.<br>"
            "• Include 5%–10% extra for machine electrification, cabling, transformer, and foundation erection costs."
        )

    # 7.2 HSN Code
    if any(k in msg_lower for k in ["hsn", "hsn code", "sac code", "tariff code"]):
        return (
            "🏷️ <strong>What is HSN Code & How to Find It:</strong><br><br>"
            "• <strong>HSN (Harmonized System of Nomenclature)</strong> is an 8-digit GST commodity classification code.<br>"
            "• <em>Examples:</em> Spices (0910), CNC Gears (8483), Solar Modules (8541), Packaged Food (2106).<br>"
            "• You can search your product's 4 to 8-digit HSN code on <code>cbic-gst.gov.in</code>."
        )

    # 7.3 Land & Building
    if any(k in msg_lower for k in ["land cost", "building cost", "civil shed", "construction cost", "rent shed", "lease agreement"]):
        return (
            "🏗️ <strong>Land & Civil Building Estimation (Section 5 & 8):</strong><br><br>"
            "• <strong>Owned Land</strong>: Enter the total land purchase price or current market valuation.<br>"
            "• <strong>Leased/Rented Shed</strong>: Enter ₹0 for land cost and add monthly lease rent under operational overheads.<br>"
            "• <strong>Industrial Shed Construction</strong>: Average industrial civil shed construction cost ranges from ₹1,200 to ₹1,800 per sq. ft."
        )

    # 7.4 Manpower & Staffing
    if any(k in msg_lower for k in ["manpower", "staff count", "salary", "wages", "employee count", "labor cost"]):
        return (
            "👥 <strong>Manpower & Staffing Plan (Section 7):</strong><br><br>"
            "• Group staff into 5 categories: Management, Supervisory, Skilled Workers, Unskilled Staff, Admin.<br>"
            "• Ensure monthly salary inputs comply with Karnataka Minimum Wages Act.<br>"
            "• Our DPR engine automatically factors in statutory 15% EPF & ESI benefits overheads."
        )

    # =============================================================
    # 8. BANKING BENCHMARKS & SUBSIDY RULES
    # =============================================================

    if any(k in msg_lower for k in ["dscr", "debt service", "coverage ratio"]):
        return (
            "📊 <strong>Debt Service Coverage Ratio (DSCR) Benchmark:</strong><br><br>"
            "• <strong>Formula</strong>: <code>(Net Profit + Interest + Depreciation) / (Interest + Annual Principal Repayment)</code><br>"
            "• <strong>Ideal Bank Range</strong>: <strong>1.50 to 2.00</strong>.<br>"
            "• <strong>Minimum Acceptable Limit</strong>: <strong>1.25</strong>.<br>"
            "• Our DPR engine calculates year-by-year DSCR automatically for bank loan sanction."
        )

    if any(k in msg_lower for k in ["pmegp", "subsidy", "kvic", "dic"]):
        return (
            "🏛️ <strong>PMEGP Government Subsidy Rules:</strong><br><br>"
            "• <strong>Max Project Cost</strong>: Up to <strong>₹50 Lakhs</strong> (Manufacturing) & <strong>₹20 Lakhs</strong> (Service).<br>"
            "• <strong>Rural Location</strong>: 35% Subsidy Grant (Special Category: Women, SC/ST/OBC) / 25% (General).<br>"
            "• <strong>Urban Location</strong>: 25% Subsidy Grant (Special Category) / 15% (General).<br>"
            "• 10-day EDP training is mandatory before subsidy lock-in release."
        )

    if any(k in msg_lower for k in ["mudra", "shishu", "kishore", "tarun"]):
        return (
            "🏦 <strong>MUDRA Loan Categories & Limits:</strong><br><br>"
            "1. <strong>Shishu</strong>: Loans up to ₹50,000 (Micro startups).<br>"
            "2. <strong>Kishore</strong>: Loans from ₹50,000 to ₹5 Lakhs (Equipment & working capital).<br>"
            "3. <strong>Tarun</strong>: Loans from ₹5 Lakhs to ₹10 Lakhs (Expansion units).<br>"
            "• Zero collateral required under CGTMSE guarantee scheme."
        )

    if any(k in msg_lower for k in ["cgtmse", "collateral", "guarantee"]):
        return (
            "🛡️ <strong>CGTMSE Collateral-Free Guarantee:</strong><br><br>"
            "• <strong>Limit</strong>: Up to <strong>₹5 Crore</strong> credit facility without third-party collateral.<br>"
            "• <strong>Guarantee Cover</strong>: 75% to 85% covered by CGTMSE Trust.<br>"
            "• Eligible for new & existing Micro and Small Enterprises (MSEs)."
        )

    if any(k in msg_lower for k in ["working capital", "cash credit", "cc limit", "nayak"]):
        return (
            "💳 <strong>Working Capital (Nayak Committee Method):</strong><br><br>"
            "• <strong>Bank Cash Credit Limit</strong> = <strong>20% of Projected Annual Turnover</strong>.<br>"
            "• <strong>Promoter Margin</strong> = <strong>5% of Projected Turnover</strong>.<br>"
            "• Includes inventory holding calculations for Raw Materials (30 days), WIP (15 days), Finished Goods (30 days), and Debtors (30 days)."
        )

    if any(k in msg_lower for k in ["cibil", "credit score"]):
        return (
            "📈 <strong>CIBIL Credit Score Benchmark:</strong><br><br>"
            "• <strong>Ideal Score</strong>: <strong>700 or above</strong>.<br>"
            "• If CIBIL score is between 600–680, add a co-applicant or guarantor with 750+ CIBIL score.<br>"
            "• Ensure no active EMI default or written-off credit balance."
        )

    if any(k in msg_lower for k in ["bep", "break even", "breakeven"]):
        return (
            "📉 <strong>Break-Even Point (BEP %) Guide:</strong><br><br>"
            "• <strong>Formula</strong>: <code>(Fixed Costs / Total Contribution) * 100</code><br>"
            "• <strong>Bank Benchmark</strong>: <strong>Below 50% to 60%</strong>.<br>"
            "• A lower BEP percentage demonstrates strong risk resilience to bank loan officers."
        )

    if any(k in msg_lower for k in ["document", "checklist", "proof", "attach"]):
        return (
            "📋 <strong>Bank Submission Document Checklist:</strong><br><br>"
            "1. <strong>Promoter KYC</strong>: Aadhaar, PAN, 3 Years ITR, 6 Months Bank Statement.<br>"
            "2. <strong>Registrations</strong>: Udyam Certificate, GST, MoA/AoA/Partnership Deed.<br>"
            "3. <strong>Land & Building</strong>: RTC / Rent Agreement / Lease Deed.<br>"
            "4. <strong>Machinery</strong>: GST Supplier Quotations.<br>"
            "5. <strong>Clearances</strong>: Trade License, FSSAI (for food), KSPCB NOC."
        )

    # =============================================================
    # 9. GREETINGS & NATURAL CONVERSATIONAL RESPONSES
    # =============================================================
    greeting_terms = {"hey", "hi", "hii", "hiii", "hello", "namaste", "good morning", "good afternoon", "good evening", "greetings"}
    if words.intersection(greeting_terms) or msg_lower in greeting_terms:
        return (
            "👋 <strong>Hello! How can I help you today?</strong><br><br>"
            "I am your <strong>Interactive AI Assistant</strong>. Ask me anything about:<br>"
            "• 📥 <strong>Downloading & Exporting</strong> your DPR report.<br>"
            "• ✏️ <strong>Editing Data & Account Help</strong> (resetting password, updating details).<br>"
            "• 🏭 <strong>Form Guidance</strong> (machinery cost, manpower salaries, HSN codes).<br>"
            "• 🏦 <strong>Bank Loan & Subsidy Rules</strong> (DSCR ratios, PMEGP, MUDRA, CGTMSE).<br><br>"
            "What query can I solve for you?"
        )

    if any(k in msg_lower for k in ["thank", "thanks", "thankyou", "awesome", "great", "perfect", "good"]):
        return (
            "😊 <strong>You're very welcome!</strong><br><br>"
            "I'm glad I could assist you. If you have any more questions about downloading your report, editing details, or bank loan guidelines, feel free to ask anytime!"
        )

    # =============================================================
    # 10. SMART DIRECT CONVERSATIONAL FALLBACK
    # =============================================================
    sec_str = f" for section <strong>'{current_section}'</strong>" if current_section else ""
    return (
        f"💬 <strong>AI Assistant Response:</strong><br><br>"
        f"Regarding your query about <em>'{message}'</em>{sec_str}:<br><br>"
        "• 📥 <strong>To download your PDF or DOCX report</strong>: Go to Step 14 (Summary) and click 'Download PDF' or 'Download DOCX'.<br>"
        "• ✏️ <strong>To edit any form details</strong>: Click the step numbers (1 to 14) in the top progress bar to update your inputs.<br>"
        "• 📞 <strong>Need platform support?</strong> Email support@visionkarnataka.org or call +91 98450 12345.<br><br>"
        "Ask me any specific question about downloads, form editing, password resets, or bank loan guidelines!"
    )

@router.post("/chat", response_model=ChatMessageResponse)
async def chat_with_assistant(payload: ChatMessageRequest):
    reply_html = generate_intelligent_assistant_reply(payload.message, payload.current_section)
    return ChatMessageResponse(success=True, reply=reply_html)
