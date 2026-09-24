import unittest
import os, sys, requests, uuid
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class TestPhase13AgentOrchestration(unittest.TestCase):

    def setUp(self):
        self.auth_url = "http://127.0.0.1:5000/api/auth"
        self.bp_url = "http://127.0.0.1:5000/api/blueprint"
        self.dpr_url = "http://127.0.0.1:5000/api/dpr"

    def test_agent_orchestration_all_7_agents(self):
        email = f"agent_user_p13_{uuid.uuid4().hex[:6]}@vkf.org"
        reg = requests.post(f"{self.auth_url}/register", json={
            "name": "P13 Agent User", "email": email, "password": "Password@123", "role": "PROMOTER"
        }).json()
        headers = {"Authorization": f"Bearer {reg['access_token']}"}

        proj = requests.post(f"{self.bp_url}/projects", headers=headers, json={
            "business_name": "Agro NextGen Tech",
            "dpr_type": "Bank Loan DPR",
            "sector_id": "agriculture",
            "activity_id": "spice_processing"
        }).json()
        p_id = proj["project_id"]

        run_agents = requests.post(f"{self.dpr_url}/projects/{p_id}/agents/run", headers=headers).json()
        self.assertTrue(run_agents["success"])
        self.assertEqual(run_agents["tasks_count"], 7)

        intel = requests.get(f"{self.dpr_url}/projects/{p_id}/intelligence", headers=headers).json()
        self.assertTrue(intel["success"])
        self.assertEqual(intel["intelligence_status"], "READY")

if __name__ == "__main__":
    unittest.main()
