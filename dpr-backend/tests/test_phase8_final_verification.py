import unittest
import os, sys, hashlib, uuid
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dpr_engine.document.ir.document_ir import DocumentIR
from dpr_engine.document.layout.page_layout import DocumentTheme
from dpr_engine.document.renderers.table_renderer import TableRenderer
from dpr_engine.document.renderers.chart_renderer import ChartRenderer
from dpr_engine.document.assemblers.html_assembler import HTMLAssembler
from dpr_engine.document.validators.document_validator import DocumentValidator
from dpr_engine.content.content_planner import DPRContentPlanner

class TestPhase8FinalVerification(unittest.TestCase):

    def setUp(self):
        self.doc_ir = DocumentIR(
            project_id="golden_proj_8a",
            snapshot_id="golden_snap_8a",
            dpr_type="Bank Loan DPR",
            title="Karnataka Precision Engineering DPR",
            metadata={"financial_summary": {"avg_dscr": 1.92, "bep_percent": 38.4}},
            cover={
                "business_name": "Karnataka Precision CNC Pvt Ltd",
                "dpr_type": "Bank Loan DPR",
                "sector_id": "manufacturing",
                "activity_id": "cnc_machining",
                "project_scale": "medium",
                "geography": "Karnataka, India",
                "date": "August 2026",
                "confidentiality": "CONFIDENTIAL — FOR BANK SUBMISSION ONLY"
            },
            doc_control={
                "document_id": "DPR-BANK-GOLDEN-8A",
                "dpr_type": "Bank Loan DPR",
                "blueprint_version": "1.0.0",
                "snapshot_version": "1.0.0",
                "financial_model_version": "1.0.0",
                "prepared_for": "Canara Bank / SBI",
                "prepared_by": "Antigravity Dynamic Platform Engine v2.0"
            },
            sections=[
                {
                    "title": "Executive Summary",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "Proposed high-precision CNC component unit."}],
                    "tables": [{"title": "Project Cost Summary", "columns": ["Item", "Amount"], "rows": [["CapEx", "₹2,50,00,000"]]}]
                },
                {
                    "title": "Business & Promoter Profile",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "Experienced promoters in aerospace machining."}]
                },
                {
                    "title": "Industry & Market Analysis",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "Market analysis for precision tools."}],
                    "chart_references": [{"chart_id": "rev_chart", "title": "5-Year Revenue Trend"}]
                },
                {
                    "title": "Technical & Location Feasibility",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "Located in Peenya Industrial Area, Bengaluru."}]
                },
                {
                    "title": "Financial Viability & Projections",
                    "content_blocks": [{"type": "PARAGRAPH", "content": "DSCR averages 1.92 over 5 years. BEP is 38.4%."}]
                }
            ],
            tables=[{"title": "Project Cost Summary", "columns": ["Item", "Amount"], "rows": [["CapEx", "₹2,50,00,000"]]}],
            charts=[{"chart_id": "rev_chart", "title": "5-Year Revenue Trend"}],
            references=[{"source_name": "MSME Karnataka", "title": "Karnataka Industrial Statistics", "url": "https://msme.karnataka.gov.in"}]
        )

    def test_three_dpr_types_blueprint_resolution(self):
        bank_plan = DPRContentPlanner.create_content_plan("Bank Loan DPR", "manufacturing", "cnc_machining", 25000000.0, "medium", None)
        govt_plan = DPRContentPlanner.create_content_plan("Govt Subsidy DPR", "food_processing", "spice_processing", 4000000.0, "small", None)
        inv_plan = DPRContentPlanner.create_content_plan("Investor / Business Pitch DPR", "it_services", "software_services", 60000000.0, "large", None)

        self.assertEqual(bank_plan["dpr_type"], "Bank Loan DPR")
        self.assertEqual(govt_plan["dpr_type"], "Govt Subsidy DPR")
        self.assertEqual(inv_plan["dpr_type"], "Investor / Business Pitch DPR")

        self.assertTrue(bank_plan["total_sections"] >= 6)
        self.assertTrue(govt_plan["total_sections"] >= 6)
        self.assertTrue(inv_plan["total_sections"] >= 6)

    def test_document_validation_and_quality_scoring(self):
        val = DocumentValidator.validate_document_ir(self.doc_ir)
        self.assertTrue(val["is_valid"])
        self.assertEqual(val["quality_score"], 100.0)
        self.assertEqual(val["quality_status"], "READY")

    def test_placeholder_detection(self):
        bad_doc = DocumentIR(
            project_id="p1", snapshot_id="s1", dpr_type="Bank Loan DPR", title="Bad Doc", metadata={}, cover={}, doc_control={},
            sections=[
                {"title": "Section 1", "content_blocks": [{"type": "PARAGRAPH", "content": "Cost is {{total_cost}} Lakhs."}]},
                {"title": "Section 2", "content_blocks": [{"type": "PARAGRAPH", "content": "TODO: Add revenue."}]},
                {"title": "Section 3", "content_blocks": [{"type": "PARAGRAPH", "content": "[PLACEHOLDER] text."}]},
                {"title": "Section 4", "content_blocks": [{"type": "PARAGRAPH", "content": "Clean narrative text."}]},
                {"title": "Section 5", "content_blocks": [{"type": "PARAGRAPH", "content": "Lorem ipsum dolor sit amet."}]}
            ],
            tables=[], charts=[], references=[]
        )
        val = DocumentValidator.validate_document_ir(bad_doc)
        self.assertFalse(val["is_valid"])
        self.assertTrue(len(val["errors"]) >= 4)
        self.assertTrue(val["quality_score"] < 50.0)

    def test_html_assembler_structure(self):
        html = HTMLAssembler.assemble_html(self.doc_ir)
        self.assertIn("<!DOCTYPE html>", html)
        self.assertIn("VISION KARNATAKA FOUNDATION", html)
        self.assertIn("Karnataka Precision CNC Pvt Ltd", html)
        self.assertIn("Executive Summary", html)
        self.assertIn("<svg class='chart-svg'", html)

    def test_checksum_calculation_and_integrity(self):
        content = b"DOCUMENT CONTENT PAYLOAD FOR SHA256 INTEGRITY TEST"
        sha1 = hashlib.sha256(content).hexdigest()
        sha2 = hashlib.sha256(content + b" CORRUPTED DATA").hexdigest()
        self.assertNotEqual(sha1, sha2)

if __name__ == "__main__":
    unittest.main()
