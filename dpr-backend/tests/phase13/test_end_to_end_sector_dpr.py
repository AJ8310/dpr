import unittest
import os, sys, requests, uuid
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class TestPhase13EndToEndSectorDPR(unittest.TestCase):

    def setUp(self):
        self.auth_url = "http://127.0.0.1:5000/api/auth"
        self.bp_url = "http://127.0.0.1:5000/api/blueprint"
        self.cnt_url = "http://127.0.0.1:5000/api/projects"
        self.doc_url = "http://127.0.0.1:5000/api/projects"

    def test_full_dynamic_dpr_pipeline(self):
        email = f"e2e_p13_{uuid.uuid4().hex[:6]}@vkf.org"
        reg = requests.post(f"{self.auth_url}/register", json={
            "name": "P13 E2E Tester", "email": email, "password": "Password@123", "role": "PROMOTER"
        }).json()
        headers = {"Authorization": f"Bearer {reg['access_token']}"}

        proj = requests.post(f"{self.bp_url}/projects", headers=headers, json={
            "business_name": "Mysore Food Park Pvt Ltd",
            "dpr_type": "Govt Subsidy DPR",
            "sector_id": "food_processing",
            "activity_id": "spice_processing",
            "project_scale": "medium"
        }).json()
        p_id = proj["project_id"]

        fin = requests.post(f"{self.cnt_url}/{p_id}/calculate", headers=headers).json()
        self.assertTrue(fin["success"])

        gen = requests.post(f"{self.cnt_url}/{p_id}/content/generate", headers=headers).json()
        self.assertTrue(gen["success"])

        snap = requests.post(f"{self.cnt_url}/{p_id}/content/snapshot", headers=headers).json()
        self.assertTrue(snap["success"])
        snap_id = snap["snapshot_id"]

        comp = requests.post(f"{self.doc_url}/{p_id}/documents/compile", headers=headers, json={
            "snapshot_id": snap_id, "format": "PDF"
        }).json()
        self.assertEqual(comp["status"], "COMPLETED")
        self.assertEqual(comp["quality_score"], 100.0)

if __name__ == "__main__":
    unittest.main()
