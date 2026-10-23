import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from typing import Optional

from config import settings
from database import SessionLocal
from models.database_models import EmailLogDB

EMAILS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "emails")
os.makedirs(EMAILS_DIR, exist_ok=True)


class EmailService:
    @staticmethod
    def _build_email_content(
        recipient_email: str,
        business_name: str,
        language: str = "en",
        order_id: Optional[str] = None,
        payment_id: Optional[str] = None,
        amount_inr: Optional[float] = None,
        dpr_type: Optional[str] = None
    ) -> tuple[str, str, str]:
        """
        Returns (subject, html_content, text_content) tailored to the specified language.
        """
        b_name = business_name or "Your Enterprise"
        d_type = dpr_type or "Detailed Project Report"
        now_str = datetime.now().strftime("%d %B %Y, %I:%M %p")
        order_str = order_id or "Direct Download"
        payment_str = payment_id or "Paid & Verified"
        price_str = f"₹{amount_inr:,.0f}" if amount_inr else "Paid"

        if language == "kn":
            subject = f"ನಿಮ್ಮ ಅಧಿಕೃತ ಡಿಪಿಆರ್ ವರದಿ ಸಿದ್ಧವಾಗಿದೆ - {b_name} | Vision Karnataka Foundation"
            headline = "ನಿಮ್ಮ ಅಧಿಕೃತ ಯೋಜನಾ ವರದಿ (DPR) ಸಿದ್ಧವಾಗಿದೆ!"
            subheadline = "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ ಮತ್ತು ನಿಮ್ಮ ವರದಿಯನ್ನು ಈ ಇಮೇಲ್‌ನಲ್ಲಿ ಲಗತ್ತಿಸಲಾಗಿದೆ."
            greeting = f"ಗೌರವಾನ್ವಿತ {b_name} ಪ್ರವರ್ತಕರಿಗೆ,"
            message_body = (
                "ವಿಷನ್ ಕರ್ನಾಟಕ ಫೌಂಡೇಶನ್ (VKF) DPR ಸ್ಟುಡಿಯೋ ಮೂಲಕ ನಿಮ್ಮ ಯೋಜನಾ ವರದಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ "
                "ತಯಾರಿಸಲಾಗಿದೆ. ಬ್ಯಾಂಕ್ ಸಾಲ ಮಂಜೂರಾತಿ, ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಮತ್ತು ಹೂಡಿಕೆದಾರರ ಪರಿಶೀಲನೆಗೆ "
                "ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ಹಣಕಾಸು ಮುನ್ನೋಟಗಳು ಮತ್ತು ತಾಂತ್ರಿಕ ವಿವರಗಳನ್ನು ಒಳಗೊಂಡ ಅಧಿಕೃತ PDF ವರದಿಯನ್ನು "
                "ಈ ಇಮೇಲ್‌ನಲ್ಲಿ ಲಗತ್ತಿಸಲಾಗಿದೆ."
            )
            details_title = "ಆರ್ಡರ್ ಮತ್ತು ಯೋಜನಾ ವಿವರಗಳು:"
            lbl_bus = "ವ್ಯಾಪಾರ / ಘಟಕದ ಹೆಸರು"
            lbl_type = "ಡಿಪಿಆರ್ ಪ್ರಕಾರ"
            lbl_order = "ಆರ್ಡರ್ ಐಡಿ"
            lbl_pay = "ಪಾವತಿ ರೆಫರೆನ್ಸ್"
            lbl_date = "ರಚಿಸಿದ ದಿನಾಂಕ"
            attachment_note = "📌 ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಅಧಿಕೃತ DPR PDF ವರದಿಯನ್ನು ಈ ಇಮೇಲ್‌ಗೆ ಲಗತ್ತಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಿ."
            footer_text = "ವಿಷನ್ ಕರ್ನಾಟಕ ಫೌಂಡೇಶನ್ (VKF) — ಕರ್ನಾಟಕದ MSME ಮತ್ತು ಉದ್ಯಮಿಗಳ ಸಬಲೀಕರಣಕ್ಕಾಗಿ."
        elif language == "hi":
            subject = f"आपकी आधिकारिक डीपीआर रिपोर्ट तैयार है - {b_name} | Vision Karnataka Foundation"
            headline = "आपकी आधिकारिक विस्तृत परियोजना रिपोर्ट (DPR) तैयार है!"
            subheadline = "भुगतान सफल रहा और आपकी बैंक-स्वीकार्य रिपोर्ट इस ईमेल में संलग्न है।"
            greeting = f"आदरणीय {b_name} के प्रमोटर,"
            message_body = (
                "विजन कर्नाटक फाउंडेशन (VKF) डीपीआर स्टूडियो के माध्यम से आपकी परियोजना रिपोर्ट "
                "सफलतापूर्वक संकलित कर ली गई है। बैंक ऋण स्वीकृति, सरकारी सब्सिडी और वित्तीय मूल्यांकन के लिए "
                "आवश्यक सभी 5-वर्षीय वित्तीय अनुमानों और अनुसूचियों से युक्त आधिकारिक पीडीएफ रिपोर्ट "
                "इस ईमेल के साथ संलग्न है।"
            )
            details_title = "ऑर्डर एवं परियोजना विवरण:"
            lbl_bus = "व्यवसाय / इकाई का नाम"
            lbl_type = "डीपीआर का प्रकार"
            lbl_order = "ऑर्डर आईडी"
            lbl_pay = "भुगतान संदर्भ"
            lbl_date = "दिनांक व समय"
            attachment_note = "📌 आपकी पूर्ण आधिकारिक DPR PDF रिपोर्ट इस ईमेल के साथ संलग्न है। कृपया इसे डाउनलोड करें।"
            footer_text = "विजन कर्नाटक फाउंडेशन (VKF) — उद्यमियों और व्यवसायों के सशक्तिकरण हेतु।"
        else:
            subject = f"Your Official Bankable DPR Report is Ready - {b_name} | Vision Karnataka Foundation"
            headline = "Your Official Bankable DPR Report is Ready!"
            subheadline = "Payment confirmed. Your publication-ready DPR has been compiled and is attached below."
            greeting = f"Dear Promoter of {b_name},"
            message_body = (
                "Thank you for generating your Detailed Project Report (DPR) with Vision Karnataka Foundation "
                "(VKF) DPR Studio. Your project data, 5-year financial projections, CMA working capital analysis, "
                "and debt service indicators (DSCR) have been compiled into an official bankable document and "
                "attached to this email for your records and banking submissions."
            )
            details_title = "Order & Project Summary:"
            lbl_bus = "Business / Unit Name"
            lbl_type = "DPR Scheme Type"
            lbl_order = "Order ID"
            lbl_pay = "Payment Reference"
            lbl_date = "Generated On"
            attachment_note = "📌 Your official PDF DPR report is attached to this email. Please download and review."
            footer_text = "Vision Karnataka Foundation (VKF) — Empowering MSMEs and Industrial Development."

        html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{subject}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #1E293B; }}
    .container {{ max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 140, 149, 0.08); border: 1px solid #E2E8F0; }}
    .header {{ background: linear-gradient(135deg, #008C95 0%, #005F66 100%); padding: 32px 28px; text-align: center; color: #FFFFFF; }}
    .header h1 {{ margin: 0 0 8px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }}
    .header p {{ margin: 0; font-size: 13px; opacity: 0.92; color: #CCFBF1; }}
    .badge {{ display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; margin-top: 12px; letter-spacing: 0.5px; text-transform: uppercase; }}
    .body {{ padding: 28px 28px 20px 28px; }}
    .greeting {{ font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }}
    .message {{ font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 22px; }}
    .summary-card {{ background: #F0FDFA; border: 1.5px solid #CCFBF1; border-radius: 12px; padding: 18px; margin-bottom: 22px; }}
    .summary-title {{ font-size: 13px; font-weight: 800; color: #008C95; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #99F6E4; padding-bottom: 6px; }}
    .summary-row {{ display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed #E2E8F0; }}
    .summary-row:last-child {{ border-bottom: none; }}
    .summary-label {{ color: #64748B; font-weight: 500; }}
    .summary-value {{ color: #0F172A; font-weight: 700; text-align: right; }}
    .attachment-box {{ background: #FFFBEB; border: 1.5px dashed #F59E0B; border-radius: 12px; padding: 14px 16px; margin-bottom: 22px; font-size: 13px; color: #92400E; font-weight: 600; text-align: center; }}
    .features {{ background: #F8FAFC; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px; font-size: 12px; color: #64748B; line-height: 1.6; }}
    .features strong {{ color: #334155; }}
    .footer {{ background: #F1F5F9; padding: 20px 28px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }}
    .footer p {{ margin: 4px 0; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #A7F3D0; margin-bottom: 6px;">VISION KARNATAKA FOUNDATION</div>
      <h1>{headline}</h1>
      <p>{subheadline}</p>
      <div class="badge">Official Bankable Document</div>
    </div>
    
    <div class="body">
      <div class="greeting">{greeting}</div>
      <div class="message">{message_body}</div>
      
      <div class="summary-card">
        <div class="summary-title">{details_title}</div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-size: 13px;">{lbl_bus}:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; font-size: 13px; text-align: right;">{b_name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-size: 13px;">{lbl_type}:</td>
            <td style="padding: 6px 0; color: #008C95; font-weight: 700; font-size: 13px; text-align: right;">{d_type}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-size: 13px;">{lbl_order}:</td>
            <td style="padding: 6px 0; color: #334155; font-family: monospace; font-size: 12px; text-align: right;">{order_str}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-size: 13px;">{lbl_pay}:</td>
            <td style="padding: 6px 0; color: #059669; font-weight: 700; font-size: 13px; text-align: right;">{payment_str}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-size: 13px;">{lbl_date}:</td>
            <td style="padding: 6px 0; color: #334155; font-size: 12px; text-align: right;">{now_str}</td>
          </tr>
        </table>
      </div>

      <div class="attachment-box">
        {attachment_note}
      </div>

      <div class="features">
        <strong>Report Features Included:</strong> Complete Project Overview, Means of Finance, 5-Year Profitability & Balance Sheet Projections, DSCR & Cash Flow Modeling, Break-Even Analysis, Sensitivity Tests, and Official Bankable Annexures.
      </div>
    </div>

    <div class="footer">
      <p><strong>{footer_text}</strong></p>
      <p>For inquiries or bank submission support, contact: info@visionkarnataka.org</p>
      <p style="color: #94A3B8; font-size: 11px; margin-top: 8px;">This is an automated system email from VKF DPR Studio. Please retain this email for your banking records.</p>
    </div>
  </div>
</body>
</html>"""

        text_content = f"""{subject}

{headline}
{subheadline}

{greeting}

{message_body}

{details_title}
- {lbl_bus}: {b_name}
- {lbl_type}: {d_type}
- {lbl_order}: {order_str}
- {lbl_pay}: {payment_str}
- {lbl_date}: {now_str}

{attachment_note}

{footer_text}
Contact: info@visionkarnataka.org
"""
        return subject, html_content, text_content

    @classmethod
    def send_dpr_report_email(
        cls,
        recipient_email: str,
        business_name: str,
        pdf_path: str,
        language: str = "en",
        order_id: Optional[str] = None,
        payment_id: Optional[str] = None,
        amount_inr: Optional[float] = None,
        dpr_type: Optional[str] = None
    ) -> dict:
        """
        Sends the compiled DPR PDF to the user's email address.
        If live SMTP is configured in .env, transmits via SMTP server.
        Otherwise, archives the email and report locally in uploads/emails/ and logs delivery.
        """
        if not recipient_email or "@" not in recipient_email:
            print(f"[Email Service] Invalid recipient email: {recipient_email}. Skipping.")
            return {"success": False, "detail": "Invalid recipient email address"}

        subject, html_body, text_body = cls._build_email_content(
            recipient_email=recipient_email,
            business_name=business_name,
            language=language,
            order_id=order_id,
            payment_id=payment_id,
            amount_inr=amount_inr,
            dpr_type=dpr_type
        )

        clean_b_name = "".join(c for c in (business_name or "DPR") if c.isalnum() or c in (" ", "_", "-")).strip().replace(" ", "_")
        attachment_filename = f"{clean_b_name}_Official_DPR_Report.pdf"

        # Prepare MIME Message
        msg = MIMEMultipart("mixed")
        from_name = settings.SMTP_FROM_NAME or "Vision Karnataka Foundation (VKF) DPR Studio"
        from_addr = settings.SMTP_FROM_EMAIL or settings.SMTP_USER or "no-reply@visionkarnataka.org"
        msg["From"] = f"{from_name} <{from_addr}>"
        msg["To"] = recipient_email
        msg["Subject"] = subject
        msg["Date"] = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")

        # Body multipart (alternative: text + html)
        alt_part = MIMEMultipart("alternative")
        alt_part.attach(MIMEText(text_body, "plain", "utf-8"))
        alt_part.attach(MIMEText(html_body, "html", "utf-8"))
        msg.attach(alt_part)

        # Attach PDF
        if pdf_path and os.path.exists(pdf_path):
            try:
                with open(pdf_path, "rb") as f:
                    part = MIMEBase("application", "pdf")
                    part.set_payload(f.read())
                    encoders.encode_base64(part)
                    part.add_header(
                        "Content-Disposition",
                        f'attachment; filename="{attachment_filename}"'
                    )
                    msg.attach(part)
            except Exception as e:
                print(f"[Email Service] Error attaching PDF: {e}")

        # Check SMTP configuration
        smtp_host = (settings.SMTP_HOST or "").strip()
        smtp_user = (settings.SMTP_USER or "").strip()
        smtp_password = (settings.SMTP_PASSWORD or "").strip()
        smtp_port = settings.SMTP_PORT or 587

        db = SessionLocal()
        try:
            if smtp_host and smtp_user:
                print(f"[Email Service] Connecting to SMTP server {smtp_host}:{smtp_port} for {recipient_email}...")
                if settings.SMTP_USE_SSL or smtp_port == 465:
                    context = ssl.create_default_context()
                    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
                        if smtp_password:
                            server.login(smtp_user, smtp_password)
                        server.sendmail(from_addr, [recipient_email], msg.as_string())
                else:
                    with smtplib.SMTP(smtp_host, smtp_port, timeout=25) as server:
                        if settings.SMTP_USE_TLS:
                            server.starttls(context=ssl.create_default_context())
                        if smtp_password:
                            server.login(smtp_user, smtp_password)
                        server.sendmail(from_addr, [recipient_email], msg.as_string())

                print(f"[Email Service] Successfully sent live DPR report email to {recipient_email}!")
                log_entry = EmailLogDB(
                    recipient_email=recipient_email,
                    business_name=business_name,
                    subject=subject,
                    status="SENT",
                    order_id=order_id,
                    pdf_filename=attachment_filename
                )
                db.add(log_entry)
                db.commit()
                return {"success": True, "status": "SENT", "recipient": recipient_email}
            else:
                # Local Archival & Simulation Mode
                timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
                safe_recip = recipient_email.replace("@", "_at_").replace(".", "_")
                archive_html_path = os.path.join(EMAILS_DIR, f"{timestamp_str}_{safe_recip}.html")
                archive_eml_path = os.path.join(EMAILS_DIR, f"{timestamp_str}_{safe_recip}.eml")

                with open(archive_html_path, "w", encoding="utf-8") as f:
                    f.write(html_body)

                with open(archive_eml_path, "w", encoding="utf-8") as f:
                    f.write(msg.as_string())

                print(
                    f"[Email Service] SMTP credentials not set in .env. "
                    f"Report email for {recipient_email} generated & archived to:\n"
                    f"  {archive_html_path}\n"
                    f"To enable live external email dispatch, configure SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env."
                )

                log_entry = EmailLogDB(
                    recipient_email=recipient_email,
                    business_name=business_name,
                    subject=subject,
                    status="LOCAL_ARCHIVED",
                    order_id=order_id,
                    pdf_filename=attachment_filename
                )
                db.add(log_entry)
                db.commit()
                return {
                    "success": True,
                    "status": "LOCAL_ARCHIVED",
                    "recipient": recipient_email,
                    "archive_path": archive_html_path,
                    "notice": "Email saved locally. Configure SMTP_HOST/SMTP_USER in .env for live transmission."
                }
        except Exception as e:
            print(f"[Email Service] Exception sending email to {recipient_email}: {e}")
            try:
                log_entry = EmailLogDB(
                    recipient_email=recipient_email,
                    business_name=business_name,
                    subject=subject,
                    status="FAILED",
                    order_id=order_id,
                    pdf_filename=attachment_filename,
                    error_message=str(e)
                )
                db.add(log_entry)
                db.commit()
            except Exception:
                db.rollback()
            return {"success": False, "status": "FAILED", "error": str(e)}
        finally:
            db.close()
