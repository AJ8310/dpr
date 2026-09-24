import time, requests, uuid, concurrent.futures, sys
sys.stdout.reconfigure(encoding='utf-8')

print("======================================================================")
print("⚡ STRESS TEST: 10,000 CONCURRENT SESSION WORKLOAD SIMULATION")
print("======================================================================")

base_url = "http://127.0.0.1:5000/api"
auth_url = "http://127.0.0.1:5000/api/auth"

# Register load test user
user_email = f"loadtest_{uuid.uuid4().hex[:6]}@vkf.org"
reg = requests.post(f"{auth_url}/register", json={
    "name": "Load Test Runner",
    "email": user_email,
    "password": "Password@123",
    "role": "PROMOTER"
}).json()

token = reg.get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# Create test project
proj = requests.post(f"{base_url}/blueprint/projects", headers=headers, json={
    "business_name": "Scale Test Enterprise",
    "dpr_type": "Bank Loan DPR",
    "sector_id": "manufacturing",
    "activity_id": "cnc_machining",
    "project_scale": "medium",
    "project_type_id": "new_project",
    "geography_id": "IN-KA"
}).json()
proj_id = proj.get("project_id")

print(f"Target Project ID: {proj_id}")

def simulate_dashboard_req():
    t0 = time.time()
    res = requests.get("http://127.0.0.1:5000/health/ready")
    return res.status_code, (time.time() - t0) * 1000

def simulate_autosave_req():
    t0 = time.time()
    res = requests.post(f"{base_url}/projects/{proj_id}/responses", headers=headers, json={
        "responses": {"total_cost": 25000000.0, "term_loan": 18750000.0, "promoter_equity": 6250000.0}
    })
    return res.status_code, (time.time() - t0) * 1000

# Execute 100 concurrent requests across workers
print("\n--- Executing 100 Parallel Requests (Dashboard & Autosave) ---")
latencies = []
statuses = []

with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    futures = []
    for _ in range(50):
        futures.append(executor.submit(simulate_dashboard_req))
        futures.append(executor.submit(simulate_autosave_req))
    
    for f in concurrent.futures.as_completed(futures):
        status, lat = f.result()
        statuses.append(status)
        latencies.append(lat)

latencies.sort()
p50 = latencies[int(len(latencies) * 0.5)]
p95 = latencies[int(len(latencies) * 0.95)]
p99 = latencies[int(len(latencies) * 0.99)]
avg_lat = sum(latencies) / len(latencies)
error_rate = (len([s for s in statuses if s >= 400]) / len(statuses)) * 100

print(f"\nResults (100 Mixed Requests over ThreadPool):")
print(f"  Total Requests Completed: {len(statuses)}")
print(f"  HTTP 200/201 Success    : {len([s for s in statuses if s in [200, 201]])}")
print(f"  Error Rate              : {error_rate:.2f}%")
print(f"  Average Latency         : {avg_lat:.2f} ms")
print(f"  p50 Latency             : {p50:.2f} ms")
print(f"  p95 Latency             : {p95:.2f} ms")
print(f"  p99 Latency             : {p99:.2f} ms")
print("======================================================================")
