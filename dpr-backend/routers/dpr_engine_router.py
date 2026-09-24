import os
import uuid
import asyncio
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models.database_models import DPRSubmissionDB
from dpr_engine.data_model import DPRDocumentModel, DPRTypeEnum, DPRDepthEnum
from dpr_engine.structures.structure_engine import DPRStructureEngine
from dpr_engine.calculations.financial_engine import DeterministicFinancialEngine
from dpr_engine.calculations.validation_engine import QualityValidationEngine
from dpr_engine.visuals.chart_engine import DeterministicChartEngine
from dpr_engine.visuals.diagram_engine import DeterministicDiagramEngine
from dpr_engine.visuals.image_engine import ImageManagementEngine
from dpr_engine.renderers.pdf_renderer import PDFDocumentRenderer
from dpr_engine.renderers.docx_renderer import DOCXDocumentRenderer
from dpr_engine.job_queue import DPRJobQueueManager

router = APIRouter(prefix="/api/dpr/engine", tags=["DPR Generation Engine"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/validate")
async def validate_dpr_data(payload: DPRDocumentModel):
    # Compute financials & run validation audit
    doc = DeterministicFinancialEngine.compute_full_financials(payload)
    audit = QualityValidationEngine.audit_document(doc)
    return {"success": True, "audit": audit}

@router.post("/preview")
async def preview_dpr_structure(payload: DPRDocumentModel):
    doc = DeterministicFinancialEngine.compute_full_financials(payload)
    structure_info = DPRStructureEngine.resolve_structure(doc)
    audit = QualityValidationEngine.audit_document(doc)

    return {
        "success": True,
        "preview": {
            "business_name": doc.business_name,
            "dpr_type": str(doc.dpr_type),
            "dpr_depth": str(doc.dpr_depth),
            "target_page_range": structure_info["target_page_range"],
            "total_cost": doc.total_cost,
            "bank_loan": doc.bank_loan,
            "promoter_contribution": doc.promoter_contribution,
            "avg_dscr": doc.avg_dscr,
            "bep_percent": doc.bep_percent,
            "structure": structure_info,
            "audit": audit
        }
    }

async def _process_generation_task(job_id: str, payload: DPRDocumentModel):
    try:
        DPRJobQueueManager.update_progress(job_id, 15, "Calculating Financial Projections")
        doc = DeterministicFinancialEngine.compute_full_financials(payload)
        doc.job_id = job_id

        DPRJobQueueManager.update_progress(job_id, 35, "Generating Financial Charts")
        DeterministicChartEngine.generate_all_charts(doc, UPLOAD_DIR)
        DeterministicDiagramEngine.generate_html_diagrams(doc)
        ImageManagementEngine.resolve_image_paths(doc, UPLOAD_DIR)

        DPRJobQueueManager.update_progress(job_id, 65, "Rendering PDF Document")
        depth_val = getattr(payload.dpr_depth, "value", str(payload.dpr_depth)).lower().replace("dprdepthenum.", "")
        pdf_filename = f"DPR_{job_id}_{depth_val}.pdf"
        output_pdf_path = os.path.join(UPLOAD_DIR, pdf_filename)
        await PDFDocumentRenderer.render_pdf(doc, TEMPLATES_DIR, output_pdf_path)

        DPRJobQueueManager.update_progress(job_id, 85, "Rendering Editable DOCX Document")
        docx_filename = f"DPR_{job_id}_{depth_val}.docx"
        output_docx_abs_path = os.path.join(UPLOAD_DIR, docx_filename)
        DOCXDocumentRenderer.render_docx(doc, output_docx_abs_path)

        DPRJobQueueManager.set_completed(job_id, pdf_filename, docx_filename)
    except Exception as e:
        print(f"Error in background generation job {job_id}: {e}")
        DPRJobQueueManager.set_failed(job_id, str(e))

@router.post("/generate")
async def generate_dpr_document(payload: DPRDocumentModel, background_tasks: BackgroundTasks):
    job_id = DPRJobQueueManager.create_job(str(payload.dpr_type), str(payload.dpr_depth))
    background_tasks.add_task(_process_generation_task, job_id, payload)

    return {
        "success": True,
        "message": f"DPR Generation Job {job_id} launched in background.",
        "job_id": job_id,
        "dpr_depth": payload.dpr_depth
    }

@router.get("/job-status/{job_id}")
async def check_job_status(job_id: str):
    status_data = DPRJobQueueManager.get_job_status(job_id)
    if not status_data:
        raise HTTPException(status_code=404, detail="Job ID not found.")
    return status_data

@router.get("/download/{job_id}")
async def download_generated_dpr(job_id: str, format: str = "pdf"):
    status_data = DPRJobQueueManager.get_job_status(job_id)
    if not status_data or str(status_data.get("status")).upper() != "COMPLETED":
        raise HTTPException(status_code=400, detail="Job not completed yet.")

    filename = status_data.get("pdf_filename") if format == "pdf" else status_data.get("docx_filename")
    if not filename:
        raise HTTPException(status_code=404, detail="File not found.")

    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Requested file missing on server.")

    media_type = "application/pdf" if format == "pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return FileResponse(filepath, media_type=media_type, filename=filename)
