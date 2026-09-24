import os
import asyncio
from typing import Dict, Any
from dpr_engine.data_model import DPRDocumentModel
from services.pdf_service import PDFService

class PDFDocumentRenderer:

    @classmethod
    async def render_pdf(cls, doc: DPRDocumentModel, templates_dir: str, output_pdf_path: str) -> str:
        data = doc.model_dump()
        return await PDFService.generate_pdf(data, templates_dir, output_pdf_path)
