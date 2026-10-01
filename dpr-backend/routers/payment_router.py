import time
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import razorpay
from config import settings

router = APIRouter(prefix="/api/payment", tags=["Razorpay Payment Gateway"])

# Server-side pricing matrix (DPR Type x Category)
PRICING_MATRIX = {
    "govt": {
        "basic": 3999,
        "entry": 3999,
        "standard": 7999,
        "core": 7999,
        "advanced": 14999,
        "team": 14999,
        "premium": 24999,
        "enterprise": 24999,
        "ent": 24999,
    },
    "bank": {
        "basic": 3999,
        "entry": 3999,
        "standard": 7999,
        "core": 7999,
        "advanced": 14999,
        "team": 14999,
        "premium": 24999,
        "enterprise": 24999,
        "ent": 24999,
    },
    "inv": {
        "basic": 4999,
        "entry": 4999,
        "standard": 9999,
        "core": 9999,
        "advanced": 19999,
        "team": 19999,
        "premium": 29999,
        "enterprise": 29999,
        "ent": 29999,
    },
}

def determine_dpr_price(dpr_type: Optional[str], category: Optional[str], fallback_amount: Optional[float] = None) -> float:
    if fallback_amount is not None and fallback_amount > 0:
        return float(fallback_amount)

    norm_type = "govt"
    if dpr_type:
        dt = dpr_type.lower()
        if "bank" in dt:
            norm_type = "bank"
        elif "inv" in dt or "pitch" in dt or "equity" in dt:
            norm_type = "inv"
        elif "govt" in dt or "subsidy" in dt:
            norm_type = "govt"

    norm_cat = "entry"
    if category:
        cat = category.lower().strip()
        if cat in ["entry", "basic", "summary"]:
            norm_cat = "entry"
        elif cat in ["core", "standard"]:
            norm_cat = "core"
        elif cat in ["team", "advanced", "detailed", "comprehensive"]:
            norm_cat = "team"
        elif cat in ["ent", "enterprise", "premium"]:
            norm_cat = "ent"
        elif "entry" in cat or "basic" in cat:
            norm_cat = "entry"
        elif "core" in cat or "standard" in cat:
            norm_cat = "core"
        elif "team" in cat or "advanced" in cat:
            norm_cat = "team"
        elif "enterprise" in cat or "premium" in cat:
            norm_cat = "ent"

    price = PRICING_MATRIX.get(norm_type, {}).get(norm_cat)
    if price is not None:
        return float(price)
    
    return float(settings.DPR_REPORT_PRICE)

class CreateOrderRequest(BaseModel):
    amount: Optional[float] = None
    currency: str = "INR"
    receipt: Optional[str] = None
    project_id: Optional[str] = None
    dpr_type: Optional[str] = None
    category: Optional[str] = None

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
    """Returns public Razorpay Key ID, pricing matrix, and default details."""
    return {
        "success": True,
        "key_id": settings.RAZORPAY_KEY_ID,
        "default_amount": settings.DPR_REPORT_PRICE,
        "pricing_matrix": PRICING_MATRIX,
        "currency": "INR"
    }

@router.post("/create-order")
async def create_razorpay_order(payload: CreateOrderRequest):
    """
    Creates an official Razorpay Order ID based on the user's selected DPR Type and Category.
    Follows: Select DPR Type -> Select Category -> Determine Price -> Create Razorpay Order.
    """
    try:
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

        return {
            "success": True,
            "order_id": order.get("id"),
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
async def verify_razorpay_payment(payload: VerifyPaymentRequest):
    """Verifies HMAC SHA256 signature from Razorpay checkout popup and unlocks DPR generation."""
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
            "unlocked": True,
            "message": "Payment verified successfully! DPR application unlocked.",
            "order_id": payload.razorpay_order_id,
            "payment_id": payload.razorpay_payment_id
        }
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Razorpay signature. Verification failed.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")
