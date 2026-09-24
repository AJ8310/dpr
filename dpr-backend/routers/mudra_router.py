"""
FastAPI Router for PMMY / MUDRA Scheme & Validation Endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from dpr_engine.intelligence.mudra_rules import MudraRulesEngine
from services.validation_service import DPRValidationService
from services.submission_pack_service import BankSubmissionPackService

router = APIRouter(prefix="/api/mudra", tags=["PMMY MUDRA Engine"])

@router.post("/category-check")
def check_mudra_category(payload: Dict[str, Any]):
    loan_amount = float(payload.get("requested_loan", 0.0))
    previous_tarun_repaid = bool(payload.get("previous_tarun_repaid", False))
    activity_id = payload.get("activity_id", "")
    is_direct_crop = bool(payload.get("is_direct_crop", False))

    category_info = MudraRulesEngine.derive_mudra_category(loan_amount, previous_tarun_repaid)
    is_agri_eligible, status_code, agri_msg = MudraRulesEngine.evaluate_sector_eligibility(activity_id, is_direct_crop)

    return {
        "mudra_category": category_info,
        "sector_eligibility": {
            "eligible": is_agri_eligible,
            "status_code": status_code,
            "message": agri_msg
        }
    }

@router.post("/validate")
def validate_dpr_submission(payload: Dict[str, Any]):
    try:
        validation_result = DPRValidationService.validate_submission_data(payload)
        return validation_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation failed: {str(e)}")

@router.post("/submission-pack")
def generate_bank_submission_pack(payload: Dict[str, Any]):
    try:
        validation_result = DPRValidationService.validate_submission_data(payload)
        submission_pack = BankSubmissionPackService.assemble_submission_pack(payload, validation_result)
        return submission_pack
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Submission pack assembly failed: {str(e)}")
