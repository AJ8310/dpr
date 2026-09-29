import time
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import razorpay
from config import settings

router = APIRouter(prefix="/api/payment", tags=["Razorpay Payment Gateway"])

class CreateOrderRequest(BaseModel):
    amount: float = 500.0  # Amount in INR (e.g. ₹500)
    currency: str = "INR"
    receipt: Optional[str] = None
    project_id: Optional[str] = None

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    project_id: Optional[str] = None

def get_razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay API keys are not configured.")
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.get("/config")
async def get_payment_config():
    """Returns public Razorpay Key ID and default pricing details."""
    return {
        "success": True,
        "key_id": settings.RAZORPAY_KEY_ID,
        "default_amount": settings.DPR_REPORT_PRICE,
        "currency": "INR"
    }

@router.post("/create-order")
async def create_razorpay_order(payload: CreateOrderRequest):
    """Creates an official Razorpay Order ID for checkout."""
    try:
        amount_to_charge = payload.amount if payload.amount and payload.amount > 0 else settings.DPR_REPORT_PRICE
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

        return {
            "success": True,
            "order_id": order.get("id"),
            "amount": order.get("amount"),
            "currency": order.get("currency"),
            "key_id": settings.RAZORPAY_KEY_ID,
            "receipt": order.get("receipt")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create Razorpay Order: {str(e)}")

@router.post("/verify-payment")
async def verify_razorpay_payment(payload: VerifyPaymentRequest):
    """Verifies HMAC SHA256 signature from Razorpay checkout popup."""
    try:
        client = get_razorpay_client()
        params_dict = {
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature
        }
        # Throws SignatureVerificationError if signature is invalid
        client.utility.verify_payment_signature(params_dict)

        return {
            "success": True,
            "message": "Payment verified successfully!",
            "order_id": payload.razorpay_order_id,
            "payment_id": payload.razorpay_payment_id
        }
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Razorpay signature. Verification failed.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")
