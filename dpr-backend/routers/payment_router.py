import time
import os
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
import razorpay
from sqlalchemy.orm import Session
from sqlalchemy import desc

from config import settings
from database import get_db, engine, Base
from models.database_models import PaymentOrderDB
from services.invoice_service import InvoiceService
from services.email_service import EmailService

# Ensure table is created
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[Database] Notice during PaymentOrderDB table check: {e}")

router = APIRouter(prefix="/api/payment", tags=["Razorpay Payment Gateway"])

# Authorized test email with bypass privileges for testing & validation
TEST_BYPASS_EMAIL = "samsajay8310@gmail.com"

# Server-side pricing matrix (DPR Type x Category)
PRICING_MATRIX = {
    "govt": {
        "basic": 399,
        "entry": 399,
        "standard": 799,
        "core": 799,
        "advanced": 999,
        "team": 999,
        "premium": 999,
        "enterprise": 999,
        "ent": 999,
        "custom": 999,
    },
    "bank": {
        "basic": 399,
        "entry": 399,
        "standard": 799,
        "core": 799,
        "advanced": 999,
        "team": 999,
        "premium": 999,
        "enterprise": 999,
        "ent": 999,
        "custom": 999,
    },
    "inv": {
        "basic": 399,
        "entry": 399,
        "standard": 799,
        "core": 799,
        "advanced": 999,
        "team": 999,
        "premium": 999,
        "enterprise": 999,
        "ent": 999,
        "custom": 999,
    },
}

def determine_dpr_price(dpr_type: Optional[str], category: Optional[str], fallback_amount: Optional[float] = None) -> float:
    norm_type = "govt"
    if dpr_type:
        dt = dpr_type.lower()
        if "bank" in dt or "loan" in dt or "nbfc" in dt:
            norm_type = "bank"
        elif "inv" in dt or "pitch" in dt or "equity" in dt or "vc" in dt:
            norm_type = "inv"
        elif "govt" in dt or "subsidy" in dt:
            norm_type = "govt"

    norm_cat = "core"
    if category:
        cat = category.lower().strip()
        if cat in ["entry", "basic", "summary"]:
            norm_cat = "entry"
        elif cat in ["core", "standard"]:
            norm_cat = "core"
        elif cat in ["team", "advanced", "detailed", "comprehensive"]:
            norm_cat = "team"
        elif cat in ["ent", "enterprise", "premium", "custom"]:
            norm_cat = "ent"
        elif "entry" in cat or "basic" in cat:
            norm_cat = "entry"
        elif "core" in cat or "standard" in cat:
            norm_cat = "core"
        elif "team" in cat or "advanced" in cat:
            norm_cat = "team"
        elif "enterprise" in cat or "premium" in cat or "custom" in cat:
            norm_cat = "ent"

    price = PRICING_MATRIX.get(norm_type, {}).get(norm_cat)
    if price is not None and price > 0:
        return float(price)
    
    if fallback_amount is not None and fallback_amount in [399, 799, 999]:
        return float(fallback_amount)

    return 799.0

# Request Models
class CreateOrderRequest(BaseModel):
    amount: Optional[float] = None
    currency: str = "INR"
    receipt: Optional[str] = None
    project_id: Optional[str] = None
    dpr_type: Optional[str] = None
    category: Optional[str] = None
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    business_name: Optional[str] = None

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    project_id: Optional[str] = None
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    business_name: Optional[str] = None
    customer_name: Optional[str] = None
    language: Optional[str] = "en"

class RecordFailureRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    error_code: Optional[str] = None
    error_description: Optional[str] = None
    error_source: Optional[str] = None
    error_step: Optional[str] = None
    error_reason: Optional[str] = None

def get_razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay API keys are not configured.")
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.get("/config")
async def get_payment_config():
    """Returns pricing matrix, currency, and default details (no secrets exposed)."""
    return {
        "success": True,
        "default_amount": settings.DPR_REPORT_PRICE,
        "pricing_matrix": PRICING_MATRIX,
        "currency": "INR"
    }

@router.post("/create-order")
async def create_razorpay_order(payload: CreateOrderRequest, db: Session = Depends(get_db)):
    """
    Creates an official Razorpay Order ID based on the user's selected DPR Type and Category,
    and registers the order in the database for lifecycle management.
    """
    try:
        # Check if caller is the authorized validation test account
        user_email_clean = (payload.user_email or "").strip().lower()
        if user_email_clean == TEST_BYPASS_EMAIL:
            bypass_order_id = f"order_bypass_{int(time.time())}"
            receipt_id = payload.receipt or f"rcpt_bypass_{int(time.time())}"
            test_record = PaymentOrderDB(
                order_id=bypass_order_id,
                receipt=receipt_id,
                user_id=payload.user_id,
                user_email=TEST_BYPASS_EMAIL,
                user_phone=payload.user_phone,
                business_name=payload.business_name or "Test Project Enterprise",
                dpr_type=payload.dpr_type or "Bank Loan DPR",
                plan_category=payload.category or "core",
                amount_inr=0.0,
                amount_paise=0,
                currency="INR",
                status="PAID",
                metadata_json={"bypass": True, "reason": "Authorized validation test account"}
            )
            db.add(test_record)
            db.commit()
            return {
                "success": True,
                "order_id": bypass_order_id,
                "amount": 0,
                "currency": "INR",
                "amount_inr": 0.0,
                "dpr_type": payload.dpr_type or "Bank Loan DPR",
                "category": payload.category or "Basic / Entry",
                "key_id": settings.RAZORPAY_KEY_ID or "rzp_test_bypass",
                "receipt": receipt_id,
                "bypass": True
            }

        amount_to_charge = determine_dpr_price(payload.dpr_type, payload.category, payload.amount)
        amount_in_paise = int(amount_to_charge * 100)
        currency = payload.currency or "INR"
        receipt_id = payload.receipt or f"rcpt_dpr_{int(time.time())}"

        client = get_razorpay_client()
        order_data = {
            "amount": amount_in_paise,
            "currency": currency,
            "receipt": receipt_id,
            "payment_capture": 1  # Auto-capture payment upon checkout
        }
        order = client.order.create(data=order_data)
        order_id = order.get("id")

        # Persist order in database for order management and audit
        try:
            db_order = PaymentOrderDB(
                order_id=order_id,
                receipt=receipt_id,
                user_id=payload.user_id,
                user_email=payload.user_email,
                user_phone=payload.user_phone,
                business_name=payload.business_name,
                dpr_type=payload.dpr_type or "Bank Loan DPR",
                plan_category=payload.category or "core",
                amount_inr=amount_to_charge,
                amount_paise=amount_in_paise,
                currency=currency,
                status="CREATED",
                metadata_json={
                    "project_id": payload.project_id,
                    "razorpay_order": order
                }
            )
            db.add(db_order)
            db.commit()
            db.refresh(db_order)
        except Exception as db_err:
            db.rollback()
            print(f"[Payment] Notice: Failed to persist order in DB: {db_err}")

        return {
            "success": True,
            "order_id": order_id,
            "amount": order.get("amount"),
            "currency": order.get("currency"),
            "amount_inr": amount_to_charge,
            "dpr_type": payload.dpr_type or "Govt Scheme / Subsidy DPR",
            "category": payload.category or "Basic / Entry",
            "key_id": settings.RAZORPAY_KEY_ID,
            "receipt": order.get("receipt")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create Razorpay Order: {str(e)}")

@router.post("/verify-payment")
async def verify_razorpay_payment(
    payload: VerifyPaymentRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Verifies HMAC SHA256 signature from Razorpay checkout popup,
    updates order status to PAID, generates an official Tax Invoice PDF,
    dispatches the invoice to the user's registered email via background task,
    and unlocks DPR generation.
    """
    try:
        client = get_razorpay_client()
        params_dict = {
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature
        }
        # Throws SignatureVerificationError if signature is invalid
        client.utility.verify_payment_signature(params_dict)

        # Update order in database to PAID
        order_record = db.query(PaymentOrderDB).filter(PaymentOrderDB.order_id == payload.razorpay_order_id).first()
        now = datetime.utcnow()
        if order_record:
            order_record.status = "PAID"
            order_record.payment_id = payload.razorpay_payment_id
            order_record.signature = payload.razorpay_signature
            order_record.paid_at = now
            if payload.user_email and not order_record.user_email:
                order_record.user_email = payload.user_email
            if payload.user_phone and not order_record.user_phone:
                order_record.user_phone = payload.user_phone
            if payload.business_name and not order_record.business_name:
                order_record.business_name = payload.business_name
        else:
            # Fallback create record if order was created earlier or outside current session
            order_record = PaymentOrderDB(
                order_id=payload.razorpay_order_id,
                payment_id=payload.razorpay_payment_id,
                signature=payload.razorpay_signature,
                status="PAID",
                user_email=payload.user_email,
                user_phone=payload.user_phone,
                business_name=payload.business_name or "Enterprise",
                paid_at=now
            )
            db.add(order_record)
        
        db.commit()
        db.refresh(order_record)

        # Generate Official Tax Invoice PDF
        recipient_email = (order_record.user_email or payload.user_email or "").strip()
        invoice_data = {
            "order_id": payload.razorpay_order_id,
            "payment_id": payload.razorpay_payment_id,
            "user_email": recipient_email,
            "user_phone": order_record.user_phone or payload.user_phone,
            "customer_name": payload.customer_name or order_record.business_name,
            "business_name": order_record.business_name or payload.business_name or "Enterprise",
            "dpr_type": order_record.dpr_type,
            "plan_category": order_record.plan_category,
            "amount_inr": order_record.amount_inr or 799.0,
            "currency": order_record.currency or "INR",
            "paid_at": order_record.paid_at or now
        }

        try:
            invoice_no, invoice_path = await InvoiceService.generate_invoice_pdf(invoice_data)
            order_record.invoice_number = invoice_no
            order_record.invoice_path = invoice_path
            db.commit()
        except Exception as inv_err:
            print(f"[Payment] Notice: Invoice PDF generation error: {inv_err}")
            invoice_no = InvoiceService.generate_invoice_number(payload.razorpay_order_id)
            invoice_path = None

        # Automatically email the Tax Invoice to the user's registered email
        if recipient_email and "@" in recipient_email:
            background_tasks.add_task(
                EmailService.send_invoice_email,
                recipient_email=recipient_email,
                business_name=order_record.business_name or "Enterprise",
                invoice_number=invoice_no,
                invoice_pdf_path=invoice_path,
                order_id=payload.razorpay_order_id,
                payment_id=payload.razorpay_payment_id,
                amount_inr=order_record.amount_inr or 799.0,
                dpr_type=order_record.dpr_type,
                language=payload.language or "en"
            )
            print(f"[Payment] Scheduled Tax Invoice email to registered email: {recipient_email}")

        return {
            "success": True,
            "unlocked": True,
            "status": "PAID",
            "message": "Payment verified successfully! Tax invoice generated and dispatched to your registered email.",
            "order_id": payload.razorpay_order_id,
            "payment_id": payload.razorpay_payment_id,
            "invoice_number": invoice_no,
            "invoice_url": f"/api/payment/invoice/{payload.razorpay_order_id}",
            "recipient_email": recipient_email
        }
    except razorpay.errors.SignatureVerificationError:
        # Mark order as failed verification in database
        try:
            order_record = db.query(PaymentOrderDB).filter(PaymentOrderDB.order_id == payload.razorpay_order_id).first()
            if order_record:
                order_record.status = "FAILED"
                order_record.error_code = "INVALID_SIGNATURE"
                order_record.error_description = "Razorpay HMAC SHA256 signature verification failed."
                db.commit()
        except Exception:
            db.rollback()
        raise HTTPException(status_code=400, detail="Invalid Razorpay signature. Verification failed.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")

@router.post("/record-failure")
async def record_payment_failure(payload: RecordFailureRequest, db: Session = Depends(get_db)):
    """
    Records a payment failure or checkout cancellation from Razorpay SDK,
    updating the order status in the database so failures can be audited and managed.
    """
    try:
        order_record = db.query(PaymentOrderDB).filter(PaymentOrderDB.order_id == payload.razorpay_order_id).first()
        if order_record:
            order_record.status = "FAILED" if payload.error_code != "PAYMENT_DISMISSED" else "CANCELLED"
            if payload.razorpay_payment_id:
                order_record.payment_id = payload.razorpay_payment_id
            order_record.error_code = payload.error_code
            order_record.error_description = payload.error_description
            db.commit()
            return {
                "success": True,
                "order_id": payload.razorpay_order_id,
                "status": order_record.status,
                "message": "Payment failure recorded successfully."
            }
        else:
            # Create a placeholder record
            failed_record = PaymentOrderDB(
                order_id=payload.razorpay_order_id,
                payment_id=payload.razorpay_payment_id,
                status="FAILED",
                error_code=payload.error_code,
                error_description=payload.error_description
            )
            db.add(failed_record)
            db.commit()
            return {
                "success": True,
                "order_id": payload.razorpay_order_id,
                "status": "FAILED",
                "message": "Payment failure logged."
            }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": str(e)
        }

@router.get("/check-status/{order_id}")
async def check_order_status(
    order_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Directly checks Razorpay live servers for payment status on an order ID and syncs database."""
    if order_id.startswith("order_bypass_") or "bypass" in order_id:
        return {
            "order_id": order_id,
            "status": "paid",
            "paid": True,
            "amount_inr": 0.0,
            "bypass": True
        }
    try:
        client = get_razorpay_client()
        order = client.order.fetch(order_id)
        order_status = order.get("status")
        
        payments = client.order.payments(order_id)
        items = payments.get("items", [])
        
        captured_payment = next((p for p in items if p.get("status") in ["captured", "authorized"]), None)
        is_paid = (order_status == "paid" or captured_payment is not None)
        
        # Synchronize status in database
        try:
            order_record = db.query(PaymentOrderDB).filter(PaymentOrderDB.order_id == order_id).first()
            if order_record:
                if is_paid and order_record.status != "PAID":
                    order_record.status = "PAID"
                    if captured_payment:
                        order_record.payment_id = captured_payment.get("id")
                    order_record.paid_at = datetime.utcnow()
                    
                    # Generate invoice if missing
                    if not order_record.invoice_path:
                        try:
                            invoice_data = {
                                "order_id": order_record.order_id,
                                "payment_id": order_record.payment_id or "PAID",
                                "user_email": order_record.user_email,
                                "user_phone": order_record.user_phone,
                                "business_name": order_record.business_name or "Enterprise",
                                "dpr_type": order_record.dpr_type,
                                "plan_category": order_record.plan_category,
                                "amount_inr": order_record.amount_inr,
                                "currency": order_record.currency,
                                "paid_at": order_record.paid_at
                            }
                            inv_no, inv_path = await InvoiceService.generate_invoice_pdf(invoice_data)
                            order_record.invoice_number = inv_no
                            order_record.invoice_path = inv_path
                            
                            if order_record.user_email and "@" in order_record.user_email:
                                background_tasks.add_task(
                                    EmailService.send_invoice_email,
                                    recipient_email=order_record.user_email,
                                    business_name=order_record.business_name or "Enterprise",
                                    invoice_number=inv_no,
                                    invoice_pdf_path=inv_path,
                                    order_id=order_record.order_id,
                                    payment_id=order_record.payment_id or "PAID",
                                    amount_inr=order_record.amount_inr or 799.0,
                                    dpr_type=order_record.dpr_type
                                )
                        except Exception as inv_e:
                            print(f"[Payment] check_order_status invoice generation notice: {inv_e}")

                    db.commit()
                elif not is_paid and items:
                    failed_p = next((p for p in items if p.get("status") == "failed"), None)
                    if failed_p and order_record.status not in ["PAID"]:
                        order_record.status = "FAILED"
                        order_record.error_code = failed_p.get("error_code")
                        order_record.error_description = failed_p.get("error_description")
                        db.commit()
        except Exception as db_sync_err:
            print(f"[Payment] DB sync error on check-status: {db_sync_err}")

        return {
            "success": True,
            "paid": is_paid,
            "order_status": order_status,
            "payment_count": len(items),
            "order_id": order_id,
            "amount_inr": order.get("amount", 0) / 100.0,
            "currency": order.get("currency", "INR")
        }
    except Exception as e:
        return {
            "success": False,
            "paid": False,
            "error": str(e)
        }

@router.get("/orders")
async def list_payment_orders(
    status: Optional[str] = None,
    user_email: Optional[str] = None,
    dpr_type: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Lists payment orders stored in the database for order management and audit.
    """
    try:
        query = db.query(PaymentOrderDB)
        if status and isinstance(status, str):
            query = query.filter(PaymentOrderDB.status == status.upper().strip())
        if user_email and isinstance(user_email, str):
            query = query.filter(PaymentOrderDB.user_email.ilike(f"%{user_email.strip()}%"))
        if dpr_type and isinstance(dpr_type, str):
            query = query.filter(PaymentOrderDB.dpr_type.ilike(f"%{dpr_type.strip()}%"))

        total = query.count()
        actual_limit = limit if isinstance(limit, int) else 50
        actual_offset = offset if isinstance(offset, int) else 0
        orders = query.order_by(desc(PaymentOrderDB.created_at)).offset(actual_offset).limit(actual_limit).all()

        return {
            "success": True,
            "total": total,
            "limit": limit,
            "offset": offset,
            "orders": [
                {
                    "id": o.id,
                    "order_id": o.order_id,
                    "receipt": o.receipt,
                    "user_email": o.user_email,
                    "business_name": o.business_name,
                    "dpr_type": o.dpr_type,
                    "plan_category": o.plan_category,
                    "amount_inr": o.amount_inr,
                    "currency": o.currency,
                    "status": o.status,
                    "payment_id": o.payment_id,
                    "error_code": o.error_code,
                    "error_description": o.error_description,
                    "created_at": o.created_at.isoformat() if o.created_at else None,
                    "paid_at": o.paid_at.isoformat() if o.paid_at else None
                }
                for o in orders
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch orders: {str(e)}")

@router.get("/orders/{order_id}")
async def get_payment_order_details(order_id: str, db: Session = Depends(get_db)):
    """
    Returns full details of a specific payment order by its Razorpay Order ID.
    """
    order = db.query(PaymentOrderDB).filter(PaymentOrderDB.order_id == order_id).first()
    if not order:
        if order_id.startswith("order_bypass_") or "bypass" in order_id:
            order = PaymentOrderDB(
                order_id=order_id,
                payment_id="pay_test_bypass",
                user_email=TEST_BYPASS_EMAIL,
                business_name="Test Project Enterprise",
                dpr_type="Bank Loan DPR",
                plan_category="core",
                amount_inr=0.0,
                status="PAID"
            )
            db.add(order)
            db.commit()
        else:
            raise HTTPException(status_code=404, detail="Order not found")

    return {
        "success": True,
        "order": {
            "id": order.id,
            "order_id": order.order_id,
            "receipt": order.receipt,
            "user_email": order.user_email,
            "user_phone": order.user_phone,
            "business_name": order.business_name,
            "dpr_type": order.dpr_type,
            "plan_category": order.plan_category,
            "amount_inr": order.amount_inr,
            "amount_paise": order.amount_paise,
            "currency": order.currency,
            "status": order.status,
            "payment_id": order.payment_id,
            "signature": order.signature,
            "error_code": order.error_code,
            "error_description": order.error_description,
            "metadata": order.metadata_json,
            "invoice_number": order.invoice_number,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "updated_at": order.updated_at.isoformat() if order.updated_at else None,
            "paid_at": order.paid_at.isoformat() if order.paid_at else None
        }
    }

@router.get("/invoice/{order_id}")
async def download_invoice_pdf(order_id: str, db: Session = Depends(get_db)):
    """
    Downloads or renders the official Tax Invoice & Payment Receipt PDF for a paid order.
    Generates it on-the-fly if not already generated.
    """
    order = db.query(PaymentOrderDB).filter(PaymentOrderDB.order_id == order_id).first()
    if not order:
        if order_id.startswith("order_bypass_") or "bypass" in order_id:
            order = PaymentOrderDB(
                order_id=order_id,
                payment_id="pay_test_bypass",
                user_email=TEST_BYPASS_EMAIL,
                business_name="Test Project Enterprise",
                dpr_type="Bank Loan DPR",
                plan_category="core",
                amount_inr=0.0,
                status="PAID"
            )
            db.add(order)
            db.commit()
        else:
            raise HTTPException(status_code=404, detail="Order not found")

    if order.status != "PAID":
        raise HTTPException(status_code=400, detail="Cannot generate invoice for unpaid or failed payment orders.")

    invoice_path = order.invoice_path
    invoice_no = order.invoice_number

    if not invoice_path or not os.path.exists(invoice_path):
        invoice_data = {
            "order_id": order.order_id,
            "payment_id": order.payment_id or "PAID",
            "user_email": order.user_email,
            "user_phone": order.user_phone,
            "business_name": order.business_name or "Enterprise",
            "dpr_type": order.dpr_type or "Detailed Project Report (DPR)",
            "plan_category": order.plan_category or "Core Plan",
            "amount_inr": order.amount_inr or 799.0,
            "currency": order.currency or "INR",
            "paid_at": order.paid_at or datetime.utcnow(),
            "invoice_number": invoice_no
        }
        invoice_no, invoice_path = await InvoiceService.generate_invoice_pdf(invoice_data)
        order.invoice_number = invoice_no
        order.invoice_path = invoice_path
        db.commit()

    return FileResponse(
        invoice_path,
        media_type="application/pdf",
        filename=f"{invoice_no or 'Tax_Invoice'}.pdf",
        headers={"Content-Disposition": f'inline; filename="{invoice_no or "Tax_Invoice"}.pdf"'}
    )
