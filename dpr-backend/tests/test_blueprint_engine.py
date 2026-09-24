import unittest
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver

class TestBlueprintEngine(unittest.TestCase):

    def test_bank_loan_blueprint_resolution(self):
        bp = DynamicBlueprintResolver.resolve_blueprint(
            dpr_type="Bank Loan DPR",
            sector_id="food_processing",
            activity_id="spice_processing",
            project_type_id="new_project",
            geography_id="IN-KA",
            project_scale="medium"
        )
        self.assertEqual(bp["dpr_type"], "Bank Loan DPR")
        self.assertEqual(bp["blueprint_id"], "blueprint_bank_loan_v1.0")
        self.assertEqual(bp["version"], "1.0.0")
        self.assertTrue(len(bp["sections"]) >= 5)
        self.assertTrue(len(bp["questions"]) >= 5)
        self.assertEqual(bp["rules"]["min_dscr_ratio"], 1.25)

    def test_investor_blueprint_resolution(self):
        bp = DynamicBlueprintResolver.resolve_blueprint(
            dpr_type="Investor / Business Pitch DPR",
            sector_id="it_services",
            activity_id="software_services",
            project_type_id="startup",
            geography_id="IN-KA",
            project_scale="small"
        )
        self.assertEqual(bp["dpr_type"], "Investor / Business Pitch DPR")
        self.assertEqual(bp["blueprint_id"], "blueprint_investor_pitch_v1.0")
        self.assertEqual(bp["version"], "1.0.0")
        self.assertEqual(bp["rules"]["min_promoter_equity_percent"], 20.0)
        self.assertTrue(any(q["id"] == "q_target_ask" for q in bp["questions"]))

    def test_govt_subsidy_blueprint_resolution(self):
        bp = DynamicBlueprintResolver.resolve_blueprint(
            dpr_type="Govt Subsidy DPR",
            sector_id="textile",
            activity_id="garment_manufacturing",
            project_type_id="new_project",
            geography_id="IN-KA",
            project_scale="micro"
        )
        self.assertEqual(bp["dpr_type"], "Govt Subsidy DPR")
        self.assertEqual(bp["rules"]["min_promoter_equity_percent"], 15.0)
        self.assertTrue(any(q["id"] == "q_scheme_name" for q in bp["questions"]))

    def test_sectors_and_activities(self):
        sectors = DynamicBlueprintResolver.get_sectors()
        self.assertTrue(len(sectors) >= 10)
        mfg_sector = next(s for s in sectors if s["id"] == "manufacturing")
        self.assertEqual(mfg_sector["name"], "Manufacturing")

        activities = DynamicBlueprintResolver.get_activities_by_sector("food_processing")
        self.assertTrue(len(activities) >= 1)
        spice_act = next(a for a in activities if a["id"] == "spice_processing")
        self.assertEqual(spice_act["hsn_code"], "09109990")

    def test_geographies_and_project_types(self):
        geos = DynamicBlueprintResolver.get_geographies()
        self.assertTrue(len(geos) >= 1)
        self.assertEqual(geos[0]["state"], "Karnataka")

        pts = DynamicBlueprintResolver.get_project_types()
        self.assertTrue(len(pts) >= 4)
        new_proj = next(p for p in pts if p["id"] == "new_project")
        self.assertIn("Greenfield", new_proj["name"])

    def test_invalid_combinations_graceful_fallback(self):
        bp = DynamicBlueprintResolver.resolve_blueprint(
            dpr_type="Unknown DPR Type",
            sector_id="invalid_sector",
            activity_id="invalid_activity",
            project_type_id="invalid_type",
            geography_id="invalid_geo"
        )
        self.assertEqual(bp["dpr_type"], "Bank Loan DPR")
        self.assertEqual(bp["version"], "1.0.0")
        self.assertTrue(len(bp["questions"]) > 0)

if __name__ == "__main__":
    unittest.main()
