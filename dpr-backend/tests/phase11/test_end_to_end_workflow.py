import unittest
import os, sys, requests, uuid
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class TestPhase11EndToEndWorkflow(unittest.TestCase):

    def setUp(self):
        self.auth_url = "http://127.0.0.1:5000/api/auth"
        self.bp_url = "http://127.0.0.1:5000/api/blueprint"
        self.q_url = "http://127.0.0.1:5000/api"
        self.cnt_url = "http://127.0.0.1:5000/api/projects"
        self.doc_url = "http://127.0.0.1:5000/api/projects"
        self.admin_url = "http://127.0.0.1:5000/api/admin"

    def test_e2e_full_user_journey_bank_loan(self):
        # 1. Login/Register Promoter
        email = f"promoter_p11_{uuid.uuid4().hex[:6]}@vkf.org"
        reg = requests.post(f"{self.auth_url}/register", json={
            "name": "P11 Promoter User", "email": email, "password": "Password@123", "role": "PROMOTER"
        }).json()
        tok = reg["access_token"]
        headers = {"Authorization": f"Bearer {tok}"}

        # 2. Select DPR Type & Create Project
        proj = requests.post(f"{self.bp_url}/projects", headers=headers, json={
            "business_name": "Karnataka Precision Aerospace Pvt Ltd",
            "dpr_type": "Bank Loan DPR",
            "sector_id": "manufacturing",
            "activity_id": "cnc_machining",
            "project_scale": "medium",
            "project_type_id": "new_project",
            "geography_id": "IN-KA"
        }).json()
        p_id = proj["project_id"]
        self.assertTrue(proj["success"])

        # 3. Form Autosave Responses
        resp = requests.post(f"{self.q_url}/projects/{p_id}/responses", headers=headers, json={
            "responses": {"total_cost": 25000000.0, "term_loan": 18750000.0, "promoter_equity": 6250000.0}
        }).json()
        self.assertTrue(resp["success"])

        # 4. Financial Calculations & Research
        fin = requests.post(f"{self.cnt_url}/{p_id}/calculate", headers=headers).json()
        self.assertTrue(fin["success"])
        res_run = requests.post(f"{self.cnt_url}/{p_id}/research/run", headers=headers).json()
        self.assertTrue(res_run["success"])

        # 5. Content Generation & Snapshot Creation
        gen = requests.post(f"{self.cnt_url}/{p_id}/content/generate", headers=headers).json()
        self.assertTrue(gen["success"])
        snap = requests.post(f"{self.cnt_url}/{p_id}/content/snapshot", headers=headers).json()
        snap_id = snap["snapshot_id"]

        # 6. Document Compilation (PDF, DOCX, HTML)
        comp_pdf = requests.post(f"{self.doc_url}/{p_id}/documents/compile", headers=headers, json={
            "snapshot_id": snap_id, "format": "PDF"
        }).json()
        self.assertEqual(comp_pdf["status"], "COMPLETED")
        self.assertEqual(comp_pdf["quality_score"], 100.0)

        comp_docx = requests.post(f"{self.doc_url}/{p_id}/documents/compile", headers=headers, json={
            "snapshot_id": snap_id, "format": "DOCX"
        }).json()
        self.assertEqual(comp_docx["status"], "COMPLETED")

        # 7. Document Listing & History
        doc_list = requests.get(f"{self.doc_url}/{p_id}/documents", headers=headers).json()
        self.assertEqual(len(doc_list["documents"]), 2)

    def test_admin_dashboard_access(self):
        email = f"admin_p11_{uuid.uuid4().hex[:6]}@vkf.org"
        reg = requests.post(f"{self.auth_url}/register", json={
            "name": "System Admin", "email": email, "password": "Password@123", "role": "ADMIN"
        }).json()
        tok = reg["access_token"]
        headers = {"Authorization": f"Bearer {tok}"}

        dash = requests.get(f"{self.admin_url}/dashboard", headers=headers).json()
        self.assertTrue(dash["success"])
        self.assertEqual(dash["system_health"]["status"], "OPERATIONAL")

if __name__ == "__main__":
    unittest.main()
