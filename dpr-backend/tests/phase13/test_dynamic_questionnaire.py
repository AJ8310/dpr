import unittest
import os, sys, requests, uuid
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class TestPhase13DynamicQuestionnaire(unittest.TestCase):

    def setUp(self):
        self.auth_url = "http://127.0.0.1:5000/api/auth"
        self.bp_url = "http://127.0.0.1:5000/api/blueprint"
        self.dpr_url = "http://127.0.0.1:5000/api/dpr"

    def test_dynamic_questionnaire_lifecycle(self):
        email = f"user_q13_{uuid.uuid4().hex[:6]}@vkf.org"
        reg = requests.post(f"{self.auth_url}/register", json={
            "name": "P13 Questionnaire User", "email": email, "password": "Password@123", "role": "PROMOTER"
        }).json()
        headers = {"Authorization": f"Bearer {reg['access_token']}"}

        proj = requests.post(f"{self.bp_url}/projects", headers=headers, json={
            "business_name": "Dynamic Spice Agro Pvt Ltd",
            "dpr_type": "Govt Subsidy DPR",
            "sector_id": "food_processing",
            "activity_id": "spice_processing",
            "project_scale": "small"
        }).json()
        p_id = proj["project_id"]

        q_get = requests.get(f"{self.dpr_url}/projects/{p_id}/questionnaire", headers=headers).json()
        self.assertTrue(q_get["success"])
        self.assertTrue(len(q_get["questions"]) >= 10)

        ans_post = requests.post(f"{self.dpr_url}/projects/{p_id}/questionnaire/answers", headers=headers, json={
            "answers": {"total_cost": 15000000.0, "q_scheme_name": "PMEGP"}
        }).json()
        self.assertTrue(ans_post["success"])

        val_post = requests.post(f"{self.dpr_url}/projects/{p_id}/questionnaire/validate", headers=headers).json()
        self.assertTrue(val_post["success"])

if __name__ == "__main__":
    unittest.main()
