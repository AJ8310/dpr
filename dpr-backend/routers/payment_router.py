from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/payment", tags=["Razorpay Payment Gateway"])

class CreateOrderRequest(BaseModel):
    amount: float = 500.0  # ₹500 INR
    currency: str = "INR"
    receipt: Optional[str] = "receipt_dpr_123"

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
async def create_razorpay_order(payload: CreateOrderRequest):
    return {
        "success": True,
        "order_id": "order_mock_1001",
        "amount": int(payload.amount * 100),
        "currency": payload.currency,
        "key_id": "rzp_test_vkf_dpr_studio"
    }

@router.post("/verify-payment")
async def verify_razorpay_payment(payload: VerifyPaymentRequest):
    return {
        "success": True,
        "message": "Payment verified successfully!"
    }
