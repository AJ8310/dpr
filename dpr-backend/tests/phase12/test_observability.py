import unittest
import os, sys, requests, uuid
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class TestPhase12Observability(unittest.TestCase):

    def setUp(self):
        self.auth_url = "http://127.0.0.1:5000/api/auth"
        self.admin_url = "http://127.0.0.1:5000/api/admin"

        email = f"admin_p12_{uuid.uuid4().hex[:6]}@vkf.org"
        reg = requests.post(f"{self.auth_url}/register", json={
            "name": "Phase 12 Ops Admin", "email": email, "password": "Password@123", "role": "ADMIN"
        }).json()
        self.tok = reg["access_token"]
        self.headers = {"Authorization": f"Bearer {self.tok}"}

    def test_admin_health_and_metrics_apis(self):
        res_health = requests.get(f"{self.admin_url}/health", headers=self.headers).json()
        self.assertTrue(res_health["success"])
        self.assertEqual(res_health["system_health"]["status"], "OPERATIONAL")

        res_metrics = requests.get(f"{self.admin_url}/metrics", headers=self.headers).json()
        self.assertTrue(res_metrics["success"])
        self.assertIn("p95_latency_ms", res_metrics["performance"])

    def test_admin_alerts_and_incidents_apis(self):
        res_alerts = requests.get(f"{self.admin_url}/alerts", headers=self.headers).json()
        self.assertTrue(res_alerts["success"])

        res_incidents = requests.get(f"{self.admin_url}/incidents", headers=self.headers).json()
        self.assertTrue(res_incidents["success"])

    def test_admin_workers_queues_backup(self):
        res_workers = requests.get(f"{self.admin_url}/workers", headers=self.headers).json()
        self.assertTrue(res_workers["success"])

        res_backup = requests.get(f"{self.admin_url}/backup/status", headers=self.headers).json()
        self.assertTrue(res_backup["success"])
        self.assertEqual(res_backup["status"], "VERIFIED")

if __name__ == "__main__":
    unittest.main()
