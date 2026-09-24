import unittest
import os, sys, requests
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class TestPhase13BlueprintResolution(unittest.TestCase):

    def setUp(self):
        self.master_url = "http://127.0.0.1:5000/api/dpr/master"

    def test_resolve_bank_loan_blueprint(self):
        res = requests.get(f"{self.master_url}/blueprints/resolve?dpr_type=Bank%20Loan%20DPR&sector_id=manufacturing&activity_id=cnc_machining").json()
        self.assertTrue(res["success"])
        bp = res["blueprint"]
        self.assertEqual(bp["dpr_type"], "Bank Loan DPR")
        self.assertTrue("questions" in bp)
        self.assertTrue("rules" in bp)
        self.assertEqual(bp["rules"]["min_promoter_equity_percent"], 20.0)

    def test_resolve_govt_subsidy_blueprint(self):
        res = requests.get(f"{self.master_url}/blueprints/resolve?dpr_type=Govt%20Subsidy%20DPR&sector_id=food_processing&activity_id=spice_processing").json()
        self.assertTrue(res["success"])
        bp = res["blueprint"]
        self.assertEqual(bp["dpr_type"], "Govt Subsidy DPR")
        self.assertEqual(bp["rules"]["min_promoter_equity_percent"], 15.0)

    def test_resolve_investor_pitch_blueprint(self):
        res = requests.get(f"{self.master_url}/blueprints/resolve?dpr_type=Investor%20/%20Business%20Pitch%20DPR&sector_id=it_services&activity_id=software_services").json()
        self.assertTrue(res["success"])
        bp = res["blueprint"]
        self.assertEqual(bp["dpr_type"], "Investor / Business Pitch DPR")

if __name__ == "__main__":
    unittest.main()
