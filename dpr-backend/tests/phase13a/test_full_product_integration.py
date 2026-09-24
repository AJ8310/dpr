import unittest
import os, sys, requests, uuid
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class TestPhase13AFullProductIntegration(unittest.TestCase):

    def setUp(self):
        self.auth_url = "http://127.0.0.1:5000/api/auth"
        self.bp_url = "http://127.0.0.1:5000/api/blueprint"
        self.q_url = "http://127.0.0.1:5000/api"
        self.cnt_url = "http://127.0.0.1:5000/api/projects"
        self.doc_url = "http://127.0.0.1:5000/api/projects"
        self.admin_url = "http://127.0.0.1:5000/api/admin"

    def test_full_product_user_journey(self):
        # 1. Register Promoter User
        email = f"promoter_p13a_{uuid.uuid4().hex[:6]}@vkf.org"
        reg = requests.post(f"{self.auth_url}/register", json={
            "name": "P13A Integration Tester", "email": email, "password": "Password@123", "role": "PROMOTER"
        }).json()
        tok = reg["access_token"]
        headers = {"Authorization": f"Bearer {tok}"}

        # 2. Select DPR Type & Create Project
        proj = requests.post(f"{self.bp_url}/projects", headers=headers, json={
            "business_name": "Bangalore Precision Tools Pvt Ltd",
            "dpr_type": "Bank Loan DPR",
            "sector_id": "manufacturing",
            "activity_id": "cnc_machining",
            "project_scale": "medium",
            "project_type_id": "new_project",
            "geography_id": "IN-KA"
        }).json()
        p_id = proj["project_id"]
        self.assertTrue(proj["success"])

        # 3. Dynamic Questionnaire Fetch & Response Autosave
        q_res = requests.get(f"{self.q_url}/questions", headers=headers).json()
        self.assertTrue(q_res["success"])

        save_res = requests.post(f"{self.q_url}/projects/{p_id}/responses", headers=headers, json={
            "responses": {"total_cost": 30000000.0, "term_loan": 22500000.0, "promoter_equity": 7500000.0}
        }).json()
        self.assertTrue(save_res["success"])

        # 4. Financial Calculations & Research Run
        fin = requests.post(f"{self.cnt_url}/{p_id}/calculate", headers=headers).json()
        self.assertTrue(fin["success"])
        res_run = requests.post(f"{self.cnt_url}/{p_id}/research/run", headers=headers).json()
        self.assertTrue(res_run["success"])

        # 5. Content Generation & Snapshot
        gen = requests.post(f"{self.cnt_url}/{p_id}/content/generate", headers=headers).json()
        self.assertTrue(gen["success"])
        snap = requests.post(f"{self.cnt_url}/{p_id}/content/snapshot", headers=headers).json()
        snap_id = snap["snapshot_id"]

        # 6. Document Compilation & Download List
        comp_pdf = requests.post(f"{self.doc_url}/{p_id}/documents/compile", headers=headers, json={
            "snapshot_id": snap_id, "format": "PDF"
        }).json()
        self.assertEqual(comp_pdf["status"], "COMPLETED")
        self.assertEqual(comp_pdf["quality_score"], 100.0)

        docs = requests.get(f"{self.doc_url}/{p_id}/documents", headers=headers).json()
        self.assertTrue(len(docs["documents"]) >= 1)

    def test_admin_operations_dashboard_integration(self):
        email = f"admin_p13a_{uuid.uuid4().hex[:6]}@vkf.org"
        reg = requests.post(f"{self.auth_url}/register", json={
            "name": "P13A Admin Tester", "email": email, "password": "Password@123", "role": "ADMIN"
        }).json()
        tok = reg["access_token"]
        headers = {"Authorization": f"Bearer {tok}"}

        dash = requests.get(f"{self.admin_url}/dashboard", headers=headers).json()
        self.assertTrue(dash["success"])
        self.assertEqual(dash["system_health"]["status"], "OPERATIONAL")

if __name__ == "__main__":
    unittest.main()
