import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

from dpr_engine.data_model import DPRDocumentModel
from dpr_engine.structures.structure_engine import DPRStructureEngine

class DOCXDocumentRenderer:

    @classmethod
    def render_docx(cls, doc: DPRDocumentModel, output_docx_path: str) -> str:
        document = Document()

        # Page Setup Margins & Page Borders
        for section in document.sections:
            section.top_margin = Inches(0.5)
            section.bottom_margin = Inches(0.5)
            section.left_margin = Inches(0.5)
            section.right_margin = Inches(0.5)

            pg_xml = (
                '<w:pgBorders xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                '<w:top w:val="single" w:sz="12" w:space="24" w:color="0F172A"/>'
                '<w:left w:val="single" w:sz="12" w:space="24" w:color="0F172A"/>'
                '<w:bottom w:val="single" w:sz="12" w:space="24" w:color="0F172A"/>'
                '<w:right w:val="single" w:sz="12" w:space="24" w:color="0F172A"/>'
                '</w:pgBorders>'
            )
            section._sectPr.append(parse_xml(pg_xml))

        # Title / Cover Block
        title_p = document.add_paragraph()
        title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run_title = title_p.add_run("VISION KARNATAKA FOUNDATION\n")
        run_title.font.size = Pt(14)
        run_title.font.bold = True
        run_title.font.color.rgb = RGBColor(15, 23, 42)

        run_sub = title_p.add_run(f"DETAILED PROJECT REPORT (DPR)\n{doc.business_name.upper()}\n")
        run_sub.font.size = Pt(18)
        run_sub.font.bold = True
        run_sub.font.color.rgb = RGBColor(30, 41, 59)

        run_track = title_p.add_run(f"DPR Track: {doc.dpr_type} | Depth: {doc.dpr_depth.upper()}\nLocation: {doc.district}, {doc.state}\n")
        run_track.font.size = Pt(10)
        run_track.font.color.rgb = RGBColor(100, 116, 139)

        document.add_heading("1.0 Executive Summary & Project Highlights", level=1)

        p_exec = document.add_paragraph()
        p_exec.add_run(
            f"{doc.business_name} is a commercial enterprise located in {doc.district}, {doc.state}. "
            f"The total project cost is estimated at ₹{doc.total_cost:,.2f}, funded by promoter contribution of ₹{doc.promoter_contribution:,.2f} "
            f"and bank loan of ₹{doc.bank_loan:,.2f}. The project features an average 5-year DSCR of {doc.avg_dscr} and break-even point of {doc.bep_percent}%."
        )

        # Key Metrics Table
        table = document.add_table(rows=5, cols=2)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.style = 'Table Grid'

        metrics = [
            ("Total Project Cost", f"₹{doc.total_cost:,.2f}"),
            ("Promoter Equity Contribution", f"₹{doc.promoter_contribution:,.2f}"),
            ("Proposed Bank Loan", f"₹{doc.bank_loan:,.2f}"),
            ("Government Subsidy Claim", f"₹{doc.subsidy:,.2f}"),
            ("Average 5-Year DSCR", f"{doc.avg_dscr}"),
        ]

        for i, (k, v) in enumerate(metrics):
            row = table.rows[i]
            row.cells[0].text = k
            row.cells[1].text = v

        document.add_heading("2.0 Cost of Project & Means of Finance", level=1)
        p_fin = document.add_paragraph()
        p_fin.add_run(
            f"Land & Site Development: ₹{doc.land_cost:,.2f}\n"
            f"Building & Civil Works: ₹{doc.building_cost:,.2f}\n"
            f"Furniture & Fixtures: ₹{doc.furniture_cost:,.2f}\n"
            f"Working Capital Margin: ₹{doc.working_capital:,.2f}\n"
            f"Total Capital Outlay: ₹{doc.total_cost:,.2f}"
        )

        # 5-Year Financial Projections Table
        if doc.projections:
            document.add_heading("3.0 5-Year Projected Income Statement (P&L)", level=1)
            p_table = document.add_table(rows=6, cols=6)
            p_table.style = 'Table Grid'

            headers = ["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]
            for col_idx, h in enumerate(headers):
                p_table.rows[0].cells[col_idx].text = h

            metrics_rows = [
                ("Capacity Utilization %", [f"{p.capacity_utilization}%" for p in doc.projections]),
                ("Gross Revenue (₹)", [f"₹{p.revenue:,.0f}" for p in doc.projections]),
                ("Total OPEX (₹)", [f"₹{p.total_opex:,.0f}" for p in doc.projections]),
                ("PAT (Net Profit) (₹)", [f"₹{p.pat:,.0f}" for p in doc.projections]),
                ("DSCR Ratio", [f"{p.dscr}" for p in doc.projections]),
            ]

            for row_idx, (m_label, m_vals) in enumerate(metrics_rows, start=1):
                r_cells = p_table.rows[row_idx].cells
                r_cells[0].text = m_label
                for c_idx, val in enumerate(m_vals, start=1):
                    r_cells[c_idx].text = val

        # Embed Generated Charts if available
        if doc.chart_paths:
            document.add_heading("4.0 Graphical Financial Projections & Analysis", level=1)
            for chart_key, c_path in doc.chart_paths.items():
                if os.path.exists(c_path):
                    document.add_paragraph(f"Chart: {chart_key.replace('_', ' ').title()}")
                    document.add_picture(c_path, width=Inches(5.5))

        document.save(output_docx_path)
        return output_docx_path
