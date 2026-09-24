import unittest
import os, sys, requests
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class TestPhase13SectorMasterData(unittest.TestCase):

    def setUp(self):
        self.master_url = "http://127.0.0.1:5000/api/dpr/master"

    def test_get_master_sectors(self):
        res = requests.get(f"{self.master_url}/sectors").json()
        self.assertTrue(res["success"])
        self.assertTrue(len(res["sectors"]) >= 5)

    def test_get_master_activities_by_sector(self):
        res = requests.get(f"{self.master_url}/sectors/food_processing/activities").json()
        self.assertTrue(res["success"])
        self.assertEqual(res["sector_id"], "food_processing")
        self.assertTrue(len(res["activities"]) >= 1)

    def test_resolve_master_blueprint(self):
        res = requests.get(f"{self.master_url}/blueprints/resolve?dpr_type=Govt%20Subsidy%20DPR&sector_id=food_processing&activity_id=spice_processing").json()
        self.assertTrue(res["success"])
        self.assertEqual(res["blueprint"]["dpr_type"], "Govt Subsidy DPR")
        self.assertEqual(res["blueprint"]["sector"]["id"], "food_processing")

if __name__ == "__main__":
    unittest.main()
