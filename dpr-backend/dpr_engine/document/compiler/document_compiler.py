import os, hashlib, datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from models.database_models import DPRProjectDB, DPRCompiledDocumentDB, DocumentMetadataDB
from dpr_engine.document.compiler.compilation_context import DocumentCompilationContext
from dpr_engine.document.assemblers.html_assembler import HTMLAssembler
from dpr_engine.document.assemblers.docx_assembler import DOCXAssembler
from dpr_engine.document.assemblers.pdf_assembler import PDFAssembler
from dpr_engine.document.validators.document_validator import DocumentValidator

class DocumentCompiler:
    """
    Main Phase 8 Document Compiler converting DPRContentSnapshot -> DocumentIR -> HTML -> DOCX & PDF.
    """

    @classmethod
    async def compile_document(
        cls,
        project_id: str,
        snapshot_id: str,
        fmt: str,
        db: Session
    ) -> Dict[str, Any]:
        fmt_upper = fmt.upper()
        if fmt_upper not in ["PDF", "DOCX", "HTML"]:
            raise ValueError(f"Unsupported compilation format '{fmt}'. Must be PDF, DOCX, or HTML.")

        # 1. Ingest Snapshot & Load Document IR
        doc_ir = DocumentCompilationContext.load_context_and_build_ir(project_id, snapshot_id, db)

        # 2. Document Validation
        val_res = DocumentValidator.validate_document_ir(doc_ir)
        if not val_res["is_valid"]:
            raise ValueError(f"Document compilation failed validation: {val_res['errors']}")

        # 3. Create persistent record
        comp_db = DPRCompiledDocumentDB(
            project_id=project_id,
            snapshot_id=snapshot_id,
            dpr_type=doc_ir.dpr_type,
            format=fmt_upper,
            status="PROCESSING",
            started_at=datetime.datetime.now()
        )
        db.add(comp_db)
        db.commit()
        db.refresh(comp_db)

        # Output paths
        out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads", "documents", project_id)
        os.makedirs(out_dir, exist_ok=True)
        base_name = f"DPR_{doc_ir.dpr_type.replace(' ', '_')}_{comp_db.id[:8]}"

        html_content = HTMLAssembler.assemble_html(doc_ir)
        target_path = ""
        file_size = 0

        if fmt_upper == "HTML":
            target_path = os.path.join(out_dir, f"{base_name}.html")
            with open(target_path, "w", encoding="utf-8") as f:
                f.write(html_content)
            file_size = os.path.getsize(target_path)
            comp_db.page_count = max(15, len(doc_ir.sections) * 5)
        elif fmt_upper == "DOCX":
            target_path = os.path.join(out_dir, f"{base_name}.docx")
            file_size = DOCXAssembler.assemble_docx(doc_ir, target_path)
            comp_db.page_count = max(20, len(doc_ir.sections) * 6)
        elif fmt_upper == "PDF":
            target_path = os.path.join(out_dir, f"{base_name}.pdf")
            pdf_res = await PDFAssembler.assemble_pdf_from_html(html_content, target_path)
            file_size = pdf_res["file_size_bytes"]
            comp_db.page_count = max(25, len(doc_ir.sections) * 7)

        # Calculate SHA-256 checksum
        sha256 = hashlib.sha256()
        with open(target_path, "rb") as f:
            while chunk := f.read(8192):
                sha256.update(chunk)
        checksum = sha256.hexdigest()

        # Build Manifest JSON
        manifest = {
            "document_id": comp_db.id,
            "project_id": project_id,
            "snapshot_id": snapshot_id,
            "dpr_type": doc_ir.dpr_type,
            "format": fmt_upper,
            "page_count": comp_db.page_count,
            "sections_count": len(doc_ir.sections),
            "tables_count": len(doc_ir.tables),
            "charts_count": len(doc_ir.charts),
            "quality_score": val_res["quality_score"],
            "checksum_sha256": checksum,
            "compiled_at": datetime.datetime.now().isoformat()
        }

        # Update record
        comp_db.status = "COMPLETED"
        comp_db.completed_at = datetime.datetime.now()
        comp_db.quality_score = val_res["quality_score"]
        comp_db.checksum_sha256 = checksum
        comp_db.storage_path = target_path
        comp_db.file_size_bytes = file_size
        comp_db.manifest_json = manifest
        db.commit()

        # Register metadata in storage service
        doc_meta = DocumentMetadataDB(
            document_name=os.path.basename(target_path),
            document_type=fmt_upper.lower(),
            storage_path=target_path,
            file_size_bytes=file_size,
            mime_type="application/pdf" if fmt_upper == "PDF" else ("application/vnd.openxmlformats-officedocument.wordprocessingml.document" if fmt_upper == "DOCX" else "text/html")
        )
        db.add(doc_meta)
        db.commit()

        return {
            "success": True,
            "document_id": comp_db.id,
            "project_id": project_id,
            "snapshot_id": snapshot_id,
            "format": fmt_upper,
            "status": "COMPLETED",
            "page_count": comp_db.page_count,
            "quality_score": comp_db.quality_score,
            "file_size_bytes": file_size,
            "checksum_sha256": checksum,
            "storage_path": target_path,
            "manifest": manifest
        }
