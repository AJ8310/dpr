import unittest
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dpr_engine.document.ir.document_ir import DocumentIR
from dpr_engine.document.layout.page_layout import DocumentTheme
from dpr_engine.document.renderers.table_renderer import TableRenderer
from dpr_engine.document.renderers.chart_renderer import ChartRenderer
from dpr_engine.document.assemblers.html_assembler import HTMLAssembler
from dpr_engine.document.validators.document_validator import DocumentValidator

class TestDocumentCompiler(unittest.TestCase):

    def setUp(self):
        self.doc_ir = DocumentIR(
            project_id="golden_proj_1",
            snapshot_id="golden_snap_1",
            dpr_type="Bank Loan DPR",
            title="Golden Bank Loan DPR Proposal",
            metadata={"financial_summary": {"avg_dscr": 1.85, "bep_percent": 42.5}},
            cover={
                "business_name": "Karnataka Precision CNC Pvt Ltd",
                "dpr_type": "Bank Loan DPR",
                "sector_id": "manufacturing",
                "activity_id": "cnc_machining",
                "project_scale": "medium",
                "geography": "Karnataka, India",
                "date": "August 2026",
                "confidentiality": "CONFIDENTIAL"
            },
            doc_control={
                "document_id": "DPR-BANK-GOLDEN-01",
                "dpr_type": "Bank Loan DPR",
                "blueprint_version": "1.0.0",
                "snapshot_version": "1.0.0",
                "financial_model_version": "1.0.0",
                "prepared_for": "State Bank of India",
                "prepared_by": "Antigravity Platform Engine v2.0"
            },
            sections=[
                {
                    "title": "Executive Summary",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "Proposed high-precision CNC component unit."}],
                    "tables": [{"title": "Project Cost", "columns": ["Item", "Amount"], "rows": [["CapEx", "₹2,50,00,000"]]}]
                },
                {
                    "title": "Business Overview",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "Sub-micron metal milling for aerospace components."}],
                    "chart_references": [{"chart_id": "rev_chart", "title": "5-Year Revenue Projection"}]
                },
                {
                    "title": "Market Demand",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "Growing demand in Karnataka industrial hubs."}]
                },
                {
                    "title": "Project Cost & Financing",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "Means of finance breakdown."}]
                },
                {
                    "title": "Financial Viability & Ratios",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "DSCR 1.85, BEP 42.5%."}]
                }
            ],
            tables=[{"title": "Project Cost", "columns": ["Item", "Amount"], "rows": [["CapEx", "₹2,50,00,000"]]}],
            charts=[{"chart_id": "rev_chart", "title": "5-Year Revenue Projection"}],
            references=[{"source_name": "KUM Karnataka", "title": "Karnataka Industrial Policy", "url": "https://kum.karnataka.gov.in"}]
        )

    def test_document_ir_construction(self):
        self.assertEqual(self.doc_ir.project_id, "golden_proj_1")
        self.assertEqual(len(self.doc_ir.sections), 5)
        self.assertEqual(len(self.doc_ir.references), 1)

    def test_html_assembler_compilation(self):
        html = HTMLAssembler.assemble_html(self.doc_ir)
        self.assertIn("<!DOCTYPE html>", html)
        self.assertIn("Karnataka Precision CNC Pvt Ltd", html)
        self.assertIn("Executive Summary", html)
        self.assertIn("<svg class='chart-svg'", html)

    def test_table_and_chart_renderers(self):
        tbl_data = {"title": "CapEx Summary", "columns": ["Item", "Cost"], "rows": [["Land", "₹50L"]]}
        html_tbl = TableRenderer.render_table_html(tbl_data)
        self.assertIn("<table class='dpr-table'", html_tbl)

        ch_data = {"chart_id": "c1", "title": "Revenue Growth"}
        svg_ch = ChartRenderer.render_chart_svg(ch_data, {})
        self.assertIn("<svg", svg_ch)
        self.assertIn("Revenue Growth", svg_ch)

    def test_document_validation_and_quality_score(self):
        val = DocumentValidator.validate_document_ir(self.doc_ir)
        self.assertTrue(val["is_valid"])
        self.assertEqual(val["quality_score"], 100.0)
        self.assertEqual(val["quality_status"], "READY")

if __name__ == "__main__":
    unittest.main()
