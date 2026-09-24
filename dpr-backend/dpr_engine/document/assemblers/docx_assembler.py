import os
from typing import Dict, Any
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

from dpr_engine.document.ir.document_ir import DocumentIR

class DOCXAssembler:
    """
    Compiles DocumentIR into native Microsoft Word (.docx) documents with styling, headings, tables, headers, footers, and page breaks.
    """

    @classmethod
    def assemble_docx(cls, doc_ir: DocumentIR, output_filepath: str) -> int:
        doc = Document()

        # Page Setup (A4 Margins)
        for section in doc.sections:
            section.top_margin = Inches(1.0)
            section.bottom_margin = Inches(1.0)
            section.left_margin = Inches(1.0)
            section.right_margin = Inches(1.0)

            # Header / Footer
            footer = section.footer
            f_p = footer.paragraphs[0]
            f_p.text = f"CONFIDENTIAL — {doc_ir.cover.get('business_name')} | Page "
            f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT

        # 1. Cover Page Title
        title_p = doc.add_paragraph()
        title_p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        run_org = title_p.add_run("VISION KARNATAKA FOUNDATION\n")
        run_org.font.size = Pt(11)
        run_org.font.bold = True
        run_org.font.color.rgb = RGBColor(100, 116, 139)

        run_title = title_p.add_run(f"{doc_ir.title}\n")
        run_title.font.size = Pt(24)
        run_title.font.bold = True
        run_title.font.color.rgb = RGBColor(15, 23, 42)

        run_sub = title_p.add_run(f"{doc_ir.dpr_type} Proposal\n\n")
        run_sub.font.size = Pt(14)
        run_sub.font.color.rgb = RGBColor(37, 99, 235)

        # Meta table
        doc.add_paragraph(f"Promoter Venture: {doc_ir.cover.get('business_name')}")
        doc.add_paragraph(f"Location: {doc_ir.cover.get('geography')}")
        doc.add_paragraph(f"Publication Date: {doc_ir.cover.get('date')}")
        doc.add_page_break()

        # 2. Document Control
        h_ctrl = doc.add_heading("Document Control & Metadata", level=1)
        ctrl_tbl = doc.add_table(rows=1, cols=2)
        ctrl_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        hdr_cells = ctrl_tbl.rows[0].cells
        hdr_cells[0].text = "Control Attribute"
        hdr_cells[1].text = "Specification"

        row_data = [
            ("Document ID", doc_ir.doc_control.get("document_id")),
            ("Blueprint Version", doc_ir.doc_control.get("blueprint_version")),
            ("Snapshot Version", doc_ir.doc_control.get("snapshot_version")),
            ("Prepared For", doc_ir.doc_control.get("prepared_for"))
        ]
        for attr, val in row_data:
            row_cells = ctrl_tbl.add_row().cells
            row_cells[0].text = str(attr)
            row_cells[1].text = str(val)

        doc.add_page_break()

        # 3. Sections & Content Blocks
        for s in doc_ir.sections:
            doc.add_heading(s.get("title"), level=1)
            blocks = s.get("content_blocks", [])
            for b in blocks:
                b_type = b.get("type")
                c = b.get("content")
                if b_type == "HEADING":
                    doc.add_heading(str(c), level=2)
                elif b_type == "SUBHEADING":
                    doc.add_heading(str(c), level=3)
                elif b_type == "PARAGRAPH":
                    doc.add_paragraph(str(c))
                elif b_type == "BULLET_LIST" and isinstance(c, list):
                    for item in c:
                        doc.add_paragraph(str(item), style='List Bullet')

            # Word Tables
            tables = s.get("tables", [])
            for t in tables:
                cols = t.get("columns", [])
                rows = t.get("rows", [])
                if cols and rows:
                    w_tbl = doc.add_table(rows=len(rows) + 1, cols=len(cols))
                    w_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                    for i, col_name in enumerate(cols):
                        w_tbl.cell(0, i).text = str(col_name)
                    for r_idx, r_vals in enumerate(rows):
                        for c_idx, val in enumerate(r_vals):
                            if c_idx < len(cols):
                                w_tbl.cell(r_idx + 1, c_idx).text = str(val)
                    doc.add_paragraph()

        # Save Word File
        os.makedirs(os.path.dirname(output_filepath), exist_ok=True)
        doc.save(output_filepath)
        return os.path.getsize(output_filepath)
