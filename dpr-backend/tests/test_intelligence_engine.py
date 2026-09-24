import unittest
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dpr_engine.intelligence.research_engine import ResearchEngine
from dpr_engine.intelligence.scheme_engine import SchemeKnowledgeEngine
from dpr_engine.intelligence.risk_engine import RiskIntelligenceEngine
from dpr_engine.intelligence.snapshot_engine import IntelligenceSnapshotEngine

class TestIntelligenceEngine(unittest.TestCase):

    def test_source_quality_classification(self):
        gov = ResearchEngine.get_source_quality("GOVERNMENT")
        self.assertEqual(gov["quality"], "HIGH")
        self.assertEqual(gov["freshness_days"], 180)

        web = ResearchEngine.get_source_quality("GENERAL_WEB")
        self.assertEqual(web["quality"], "LOW")
        self.assertEqual(web["freshness_days"], 15)

    def test_scheme_knowledge_matching(self):
        canonical_pmegp = {
            "project_cost": {"total": 4000000.0},
            "classification": {"sector_id": "food_processing"},
            "promoter": {"category": "SC/ST"}
        }

        matched = SchemeKnowledgeEngine.evaluate_project_schemes(canonical_pmegp, None)
        self.assertTrue(len(matched) >= 1)
        
        pmegp = next(s for s in matched if s["scheme_id"] == "pmegp_scheme_v1.0")
        self.assertEqual(pmegp["status"], "POTENTIALLY_APPLICABLE")
        self.assertIn("35%", pmegp["estimated_benefit"])
        self.assertIn("4,000,000.00", pmegp["rationale"])

    def test_risk_intelligence_categorization(self):
        canonical = {
            "project_cost": {"total": 15000000.0},
            "funding": {"term_loan": 10000000.0},
            "classification": {"sector_id": "food_processing"}
        }
        fin_res = {"avg_dscr": 1.28}

        # Mock DB session in unit test using Mock DB
        from unittest.mock import MagicMock
        db_mock = MagicMock()

        risks = RiskIntelligenceEngine.evaluate_project_risks("proj_mock_1", canonical, fin_res, db_mock)
        self.assertTrue(len(risks) >= 2)
        categories = [r["category"] for r in risks]
        self.assertIn("FINANCIAL", categories)
        self.assertIn("REGULATORY", categories)

if __name__ == "__main__":
    unittest.main()
