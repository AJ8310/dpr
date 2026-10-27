import os
import gc
from datetime import datetime
from typing import Optional, Tuple, Dict, Any

INVOICES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "invoices")
os.makedirs(INVOICES_DIR, exist_ok=True)

CHROMIUM_LOW_MEM_FLAGS = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-zygote",
    "--single-process",
    "--disable-extensions",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-sync",
    "--no-first-run",
    "--disable-features=IsolateOrigins,site-per-process",
    "--blink-settings=imagesEnabled=true"
]

def number_to_words_inr(amount: float) -> str:
    """Converts common INR amounts to English words for the invoice."""
    int_amount = int(round(amount))
    mapping = {
        399: "Three Hundred Ninety-Nine Rupees Only",
        799: "Seven Hundred Ninety-Nine Rupees Only",
        999: "Nine Hundred Ninety-Nine Rupees Only",
        499: "Four Hundred Ninety-Nine Rupees Only",
        1499: "One Thousand Four Hundred Ninety-Nine Rupees Only",
        1999: "One Thousand Nine Hundred Ninety-Nine Rupees Only",
    }
    if int_amount in mapping:
        return mapping[int_amount]
    return f"{int_amount:,} Rupees Only"

class InvoiceService:
    @staticmethod
    def generate_invoice_number(order_id: str) -> str:
        """Generates a clean, unique invoice number: INV-VKF-YYYYMM-XXXXXX."""
        now = datetime.utcnow()
        clean_suffix = "".join(c for c in (order_id or "ORD") if c.isalnum())[-6:].upper()
        if len(clean_suffix) < 6:
            clean_suffix = clean_suffix.ljust(6, 'X')
        return f"INV-VKF-{now.strftime('%Y%m')}-{clean_suffix}"

    @classmethod
    def render_invoice_html(cls, data: Dict[str, Any]) -> str:
        invoice_no = data.get("invoice_number") or cls.generate_invoice_number(data.get("order_id", ""))
        business_name = data.get("business_name") or "Enterprise / Promoter"
        customer_name = data.get("customer_name") or data.get("user_name") or "Authorised Signatory"
        customer_email = data.get("user_email") or "Registered Client"
        customer_phone = data.get("user_phone") or "N/A"
        dpr_type = data.get("dpr_type") or "Detailed Project Report (DPR)"
        plan_category = (data.get("plan_category") or "Core Plan").upper()
        
        amount_total = float(data.get("amount_inr") or 799.0)
        # 18% GST calculation (inclusive)
        taxable_val = round(amount_total / 1.18, 2)
        cgst_val = round((amount_total - taxable_val) / 2.0, 2)
        sgst_val = round(amount_total - taxable_val - cgst_val, 2)
        
        order_id = data.get("order_id") or "N/A"
        payment_id = data.get("payment_id") or "N/A"
        
        paid_dt = data.get("paid_at")
        if isinstance(paid_dt, datetime):
            invoice_date = paid_dt.strftime("%d %b %Y, %I:%M %p")
        elif isinstance(paid_dt, str) and paid_dt:
            invoice_date = paid_dt
        else:
            invoice_date = datetime.now().strftime("%d %b %Y, %I:%M %p")

        amount_words = number_to_words_inr(amount_total)

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - {invoice_no}</title>
  <style>
    @page {{
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #1E293B;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 13px;
      line-height: 1.5;
    }}
    .invoice-card {{
      max-width: 800px;
      margin: 0 auto;
      border: 1.5px solid #CBD5E1;
      border-radius: 12px;
      overflow: hidden;
      background: #FFFFFF;
    }}
    .header-bar {{
      background: linear-gradient(135deg, #008C95 0%, #00565D 100%);
      color: #FFFFFF;
      padding: 24px 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }}
    .brand-title {{
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.2px;
      margin: 0 0 4px 0;
      color: #FFFFFF;
    }}
    .brand-sub {{
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #CCFBF1;
      text-transform: uppercase;
    }}
    .powered-by {{
      font-size: 11px;
      color: #E2E8F0;
      margin-top: 4px;
      font-weight: 500;
    }}
    .invoice-title-box {{
      text-align: right;
    }}
    .invoice-badge {{
      display: inline-block;
      background: #10B981;
      color: #FFFFFF;
      padding: 4px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }}
    .invoice-meta-num {{
      font-size: 15px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: monospace;
      letter-spacing: 0.5px;
    }}
    .invoice-meta-date {{
      font-size: 12px;
      color: #CCFBF1;
      margin-top: 2px;
    }}
    .content-body {{
      padding: 28px 30px;
    }}
    .addresses-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1.5px solid #F1F5F9;
    }}
    .address-card {{
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 16px;
    }}
    .addr-title {{
      font-size: 10px;
      font-weight: 800;
      color: #008C95;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
    }}
    .addr-name {{
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 4px;
    }}
    .addr-detail {{
      font-size: 12px;
      color: #475569;
      line-height: 1.55;
    }}
    .payment-summary-strip {{
      background: #F0FDFA;
      border: 1.5px solid #99F6E4;
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }}
    .strip-item {{
      display: flex;
      flex-direction: column;
    }}
    .strip-label {{
      font-size: 10px;
      font-weight: 700;
      color: #0F766E;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 2px;
    }}
    .strip-value {{
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
      font-family: monospace;
      word-break: break-all;
    }}
    table.invoice-table {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }}
    table.invoice-table th {{
      background: #F1F5F9;
      color: #334155;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      text-align: left;
      border-top: 1px solid #CBD5E1;
      border-bottom: 1px solid #CBD5E1;
    }}
    table.invoice-table td {{
      padding: 12px 12px;
      border-bottom: 1px solid #E2E8F0;
      vertical-align: top;
      font-size: 12px;
    }}
    .item-title {{
      font-weight: 700;
      color: #0F172A;
      font-size: 13px;
      margin-bottom: 3px;
    }}
    .item-desc {{
      color: #64748B;
      font-size: 11px;
      line-height: 1.4;
    }}
    .totals-area {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 10px;
      padding-top: 12px;
    }}
    .words-box {{
      max-width: 55%;
      background: #F8FAFC;
      border-left: 3px solid #008C95;
      padding: 10px 14px;
      border-radius: 4px;
    }}
    .words-label {{
      font-size: 10px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }}
    .words-text {{
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
    }}
    .totals-table {{
      width: 40%;
      border-collapse: collapse;
    }}
    .totals-table td {{
      padding: 5px 8px;
      font-size: 12px;
    }}
    .totals-table tr.grand-total {{
      border-top: 2px solid #008C95;
      border-bottom: 2px solid #008C95;
      background: #F0FDFA;
    }}
    .totals-table tr.grand-total td {{
      padding: 8px 8px;
      font-size: 14px;
      font-weight: 800;
      color: #008C95;
    }}
    .paid-stamp-box {{
      margin-top: 24px;
      padding: 14px 18px;
      border: 1.5px dashed #10B981;
      border-radius: 10px;
      background: #ECFDF5;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .stamp-left {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .stamp-icon {{
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #10B981;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 18px;
    }}
    .stamp-text-main {{
      font-size: 13px;
      font-weight: 800;
      color: #065F46;
    }}
    .stamp-text-sub {{
      font-size: 11px;
      color: #047857;
    }}
    .stamp-right {{
      text-align: right;
      font-size: 11px;
      color: #065F46;
      font-weight: 600;
    }}
    .footer-note {{
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #E2E8F0;
      text-align: center;
      font-size: 10.5px;
      color: #94A3B8;
      line-height: 1.5;
    }}
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header-bar">
      <div>
        <div class="brand-sub">Vision Karnataka Foundation</div>
        <h1 class="brand-title">DPR Studio</h1>
        <div class="powered-by">Powered by Infopace Management Pvt Ltd</div>
      </div>
      <div class="invoice-title-box">
        <span class="invoice-badge">PAID & VERIFIED</span>
        <div class="invoice-meta-num">{invoice_no}</div>
        <div class="invoice-meta-date">{invoice_date}</div>
      </div>
    </div>

    <div class="content-body">
      <!-- Addresses Grid -->
      <div class="addresses-grid">
        <div class="address-card">
          <div class="addr-title">Billed By (Service Provider)</div>
          <div class="addr-name">Infopace Management Pvt Ltd</div>
          <div class="addr-detail">
            In Association with Vision Karnataka Foundation (VKF)<br>
            Bengaluru, Karnataka 560001, India<br>
            <strong>Support:</strong> support@infopaceindia.com<br>
            <strong>Web:</strong> https://visionkarnataka.org
          </div>
        </div>

        <div class="address-card">
          <div class="addr-title">Billed To (Customer Details)</div>
          <div class="addr-name">{business_name}</div>
          <div class="addr-detail">
            <strong>Contact:</strong> {customer_name}<br>
            <strong>Email:</strong> {customer_email}<br>
            <strong>Phone:</strong> {customer_phone}<br>
            <strong>Jurisdiction:</strong> Karnataka / India
          </div>
        </div>
      </div>

      <!-- Payment Summary Strip -->
      <div class="payment-summary-strip">
        <div class="strip-item">
          <span class="strip-label">Payment Gateway</span>
          <span class="strip-value" style="color: #008C95;">Razorpay Secure</span>
        </div>
        <div class="strip-item">
          <span class="strip-label">Order ID</span>
          <span class="strip-value">{order_id}</span>
        </div>
        <div class="strip-item">
          <span class="strip-label">Payment ID</span>
          <span class="strip-value">{payment_id}</span>
        </div>
        <div class="strip-item">
          <span class="strip-label">Payment Status</span>
          <span class="strip-value" style="color: #10B981;">SUCCESS (PAID)</span>
        </div>
      </div>

      <!-- Line Items Table -->
      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 8%;">#</th>
            <th style="width: 52%;">Description of Service</th>
            <th style="width: 15%; text-align: center;">SAC / HSN</th>
            <th style="width: 10%; text-align: center;">Qty</th>
            <th style="width: 15%; text-align: right;">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01</td>
            <td>
              <div class="item-title">Detailed Project Report (DPR) Digital Compilation & Bankable Appraisal</div>
              <div class="item-desc">
                Scheme: <strong>{dpr_type}</strong> • Plan: <strong>{plan_category}</strong><br>
                Includes 5-Year Financial Forecasting, CMA Working Capital Assessment, DSCR & Sensitivity Stress Tests, Break-Even Analysis & Bankable Annexures.
              </div>
            </td>
            <td style="text-align: center; font-family: monospace;">998311</td>
            <td style="text-align: center; font-weight: 700;">1</td>
            <td style="text-align: right; font-weight: 700;">₹{taxable_val:,.2f}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals & In Words -->
      <div class="totals-area">
        <div class="words-box">
          <div class="words-label">Amount in Words</div>
          <div class="words-text">{amount_words}</div>
        </div>

        <table class="totals-table">
          <tr>
            <td style="color: #64748B;">Taxable Value:</td>
            <td style="text-align: right; font-weight: 600;">₹{taxable_val:,.2f}</td>
          </tr>
          <tr>
            <td style="color: #64748B;">CGST (9.0%):</td>
            <td style="text-align: right; font-weight: 600;">₹{cgst_val:,.2f}</td>
          </tr>
          <tr>
            <td style="color: #64748B;">SGST (9.0%):</td>
            <td style="text-align: right; font-weight: 600;">₹{sgst_val:,.2f}</td>
          </tr>
          <tr class="grand-total">
            <td>Total Paid:</td>
            <td style="text-align: right;">₹{amount_total:,.2f}</td>
          </tr>
        </table>
      </div>

      <!-- Paid Stamp Box -->
      <div class="paid-stamp-box">
        <div class="stamp-left">
          <div class="stamp-icon">✓</div>
          <div>
            <div class="stamp-text-main">Payment Officially Verified & Captured</div>
            <div class="stamp-text-sub">Electronic Payment Receipt — Full DPR Report Generation Unlocked</div>
          </div>
        </div>
        <div class="stamp-right">
          Vision Karnataka Foundation (VKF)<br>
          Infopace Management Pvt Ltd
        </div>
      </div>

      <!-- Footer Note -->
      <div class="footer-note">
        This is a computer-generated tax invoice and payment receipt. No physical signature is required under IT Act provisions.<br>
        For inquiries, official bank submission questions or invoice updates, write to <strong>support@infopaceindia.com</strong> or <strong>info@visionkarnataka.org</strong>.
      </div>
    </div>
  </div>
</body>
</html>"""
        return html

    @classmethod
    def _run_playwright_sync(cls, data: Dict[str, Any], output_path: str, invoice_no: str) -> Tuple[str, str]:
        from playwright.sync_api import sync_playwright

        html_content = cls.render_invoice_html(data)

        # Save temporary HTML preview file
        html_path = output_path.replace(".pdf", ".html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True, args=CHROMIUM_LOW_MEM_FLAGS)
                page = browser.new_page()
                page.route("**/fonts.googleapis.com/**", lambda route: route.abort())
                page.route("**/fonts.gstatic.com/**", lambda route: route.abort())
                page.set_content(html_content, wait_until="domcontentloaded", timeout=12000)
                page.pdf(
                    path=output_path,
                    format="A4",
                    print_background=True,
                    margin={"top": "0.35in", "right": "0.35in", "bottom": "0.35in", "left": "0.35in"}
                )
                browser.close()
        finally:
            gc.collect()

        return invoice_no, output_path

    @classmethod
    def generate_invoice_pdf_sync(cls, data: Dict[str, Any], output_path: Optional[str] = None) -> Tuple[str, str]:
        """Synchronously compiles the invoice HTML to PDF using Playwright."""
        import asyncio
        import concurrent.futures

        invoice_no = data.get("invoice_number") or cls.generate_invoice_number(data.get("order_id", ""))
        data["invoice_number"] = invoice_no

        if not output_path:
            clean_inv = "".join(c for c in invoice_no if c.isalnum() or c in ("-", "_"))
            output_path = os.path.join(INVOICES_DIR, f"{clean_inv}.pdf")

        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                return executor.submit(cls._run_playwright_sync, data, output_path, invoice_no).result()
        else:
            return cls._run_playwright_sync(data, output_path, invoice_no)

    @classmethod
    async def generate_invoice_pdf(cls, data: Dict[str, Any], output_path: Optional[str] = None) -> Tuple[str, str]:
        """Asynchronously compiles the invoice HTML to PDF using Playwright with sync fallback."""
        import asyncio
        invoice_no = data.get("invoice_number") or cls.generate_invoice_number(data.get("order_id", ""))
        data["invoice_number"] = invoice_no

        if not output_path:
            clean_inv = "".join(c for c in invoice_no if c.isalnum() or c in ("-", "_"))
            output_path = os.path.join(INVOICES_DIR, f"{clean_inv}.pdf")

        html_content = cls.render_invoice_html(data)

        # Save HTML preview
        html_path = output_path.replace(".pdf", ".html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        try:
            from playwright.async_api import async_playwright
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True, args=CHROMIUM_LOW_MEM_FLAGS)
                page = await browser.new_page(viewport={"width": 1280, "height": 1024})
                await page.route("**/fonts.googleapis.com/**", lambda route: route.abort())
                await page.route("**/fonts.gstatic.com/**", lambda route: route.abort())
                await page.set_content(html_content, wait_until="domcontentloaded", timeout=12000)
                await page.pdf(
                    path=output_path,
                    format="A4",
                    print_background=True,
                    margin={"top": "0.35in", "right": "0.35in", "bottom": "0.35in", "left": "0.35in"}
                )
                await browser.close()
            gc.collect()
            return invoice_no, output_path
        except Exception as e:
            print(f"[Invoice Service] Async compilation warning: {e}, attempting sync fallback...")
            inv_no, out_p = await asyncio.to_thread(cls.generate_invoice_pdf_sync, data, output_path)
            return inv_no, out_p
