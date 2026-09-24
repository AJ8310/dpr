from typing import Dict, Any
from dpr_engine.document.ir.document_ir import DocumentIR
from dpr_engine.document.layout.page_layout import DocumentTheme
from dpr_engine.document.renderers.table_renderer import TableRenderer
from dpr_engine.document.renderers.chart_renderer import ChartRenderer
from dpr_engine.document.renderers.image_renderer import ImageRenderer

class HTMLAssembler:
    """
    Compiles DocumentIR into standalone production HTML with print CSS for Playwright PDF rendering and browser preview.
    """

    @classmethod
    def assemble_html(cls, doc_ir: DocumentIR) -> str:
        css = DocumentTheme.get_css()
        cover = doc_ir.cover
        doc_ctrl = doc_control = doc_ir.doc_control
        fin_summary = doc_ir.metadata.get("financial_summary", {})

        html = [
            "<!DOCTYPE html>",
            "<html lang='en'>",
            "<head>",
            "<meta charset='UTF-8'>",
            f"<title>{doc_ir.title}</title>",
            f"<style>{css}</style>",
            "</head>",
            "<body>",

            # 1. Cover Page
            "<div class='cover-page'>",
            "<div>",
            f"<div style='color:#64748b; font-size:11pt; font-weight:700; letter-spacing:1px; margin-bottom:15px;'>VISION KARNATAKA FOUNDATION</div>",
            f"<div class='cover-title'>{doc_ir.title}</div>",
            f"<div class='cover-subtitle'>{doc_ir.dpr_type} — Project Proposal</div>",
            "</div>",
            "<div style='border-top: 2px solid #e2e8f0; padding-top: 20px;'>",
            f"<p style='margin:4px 0;'><strong>Promoter Venture:</strong> {cover.get('business_name')}</p>",
            f"<p style='margin:4px 0;'><strong>Sector & Activity:</strong> {cover.get('sector_id').title()} ({cover.get('activity_id').title()})</p>",
            f"<p style='margin:4px 0;'><strong>Location:</strong> {cover.get('geography')}</p>",
            f"<p style='margin:4px 0;'><strong>Date of Publication:</strong> {cover.get('date')}</p>",
            f"<p style='margin:12px 0 0 0; font-size:8pt; color:#94a3b8;'>{cover.get('confidentiality')}</p>",
            "</div>",
            "</div>",

            # 2. Document Control Page
            "<div class='doc-control'>",
            "<h2>Document Control & Metadata</h2>",
            "<table class='dpr-table'>",
            f"<tr><td><strong>Document Control ID</strong></td><td>{doc_ctrl.get('document_id')}</td></tr>",
            f"<tr><td><strong>DPR Type Blueprint</strong></td><td>{doc_ctrl.get('dpr_type')} (v{doc_ctrl.get('blueprint_version')})</td></tr>",
            f"<tr><td><strong>Content Snapshot Version</strong></td><td>{doc_ctrl.get('snapshot_version')}</td></tr>",
            f"<tr><td><strong>Financial Model Version</strong></td><td>{doc_ctrl.get('financial_model_version')}</td></tr>",
            f"<tr><td><strong>Prepared For</strong></td><td>{doc_ctrl.get('prepared_for')}</td></tr>",
            f"<tr><td><strong>Prepared By</strong></td><td>{doc_ctrl.get('prepared_by')}</td></tr>",
            "</table>",
            "</div>",

            # 3. Table of Contents
            "<div style='page-break-after: always;'>",
            "<h2>Table of Contents</h2>",
            "<ol style='line-height:2.0; font-size:11pt; font-weight:500; padding-left:20px;'>"
        ]

        for s in doc_ir.sections:
            html.append(f"<li>{s.get('title')}</li>")

        html.append("</ol></div>")

        # 4. Sections & Blocks
        for s in doc_ir.sections:
            html.append(f"<div class='dpr-section' style='margin-bottom:30px;'>")
            html.append(f"<h1>{s.get('title')}</h1>")

            # Blocks
            blocks = s.get("content_blocks", [])
            for b in blocks:
                b_type = b.get("type")
                c = b.get("content")
                if b_type == "HEADING":
                    html.append(f"<h2>{c}</h2>")
                elif b_type == "SUBHEADING":
                    html.append(f"<h3>{c}</h3>")
                elif b_type == "PARAGRAPH":
                    html.append(f"<p>{c}</p>")
                elif b_type == "BULLET_LIST" and isinstance(c, list):
                    html.append("<ul>")
                    for item in c:
                        html.append(f"<li>{item}</li>")
                    html.append("</ul>")

            # Tables
            tables = s.get("tables", [])
            for t in tables:
                html.append(TableRenderer.render_table_html(t))

            # Charts
            charts = s.get("chart_references", [])
            for ch in charts:
                html.append(ChartRenderer.render_chart_svg(ch, fin_summary))

            html.append("</div>")

        # 5. References Section
        if doc_ir.references:
            html.append("<div class='page-break'><h1>Verified Research Sources & References</h1><ol>")
            for ref in doc_ir.references:
                html.append(f"<li><strong>{ref.get('source_name', 'Research Source')}</strong> — <em>{ref.get('title')}</em>. URL: <a href='{ref.get('url')}'>{ref.get('url')}</a></li>")
            html.append("</ol></div>")

        html.append("</body></html>")
        return "".join(html)
