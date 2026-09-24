import requests, sys, uuid, time, concurrent.futures

sys.stdout.reconfigure(encoding='utf-8')
print("======================================================================")
print("🚀 PHASE 12 OPERATIONAL LOAD & ENTERPRISE CHAOS TEST")
print("======================================================================")

auth_url = "http://127.0.0.1:5000/api/auth"
admin_url = "http://127.0.0.1:5000/api/admin"

email = f"ops_load_{uuid.uuid4().hex[:6]}@vkf.org"
token = requests.post(f"{auth_url}/register", json={
    "name": "Phase 12 Load Tester", "email": email, "password": "Password@123", "role": "ADMIN"
}).json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

def hit_admin_health(idx):
    t0 = time.time()
    res = requests.get(f"{admin_url}/health", headers=headers)
    return res.status_code, (time.time() - t0) * 1000

print("\n--- Executing 100 Parallel Admin Operational Requests ---")
latencies = []
statuses = []

with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(hit_admin_health, i) for i in range(100)]
    for f in concurrent.futures.as_completed(futures):
        status, lat = f.result()
        statuses.append(status)
        latencies.append(lat)

latencies.sort()
p50 = latencies[int(len(latencies) * 0.5)]
p95 = latencies[int(len(latencies) * 0.95)]
avg_lat = sum(latencies) / len(latencies)
error_rate = (len([s for s in statuses if s >= 400]) / len(statuses)) * 100

print(f"Phase 12 Admin Operations Metrics:")
print(f"  Total Requests Completed: {len(statuses)}")
print(f"  HTTP 200 Success        : {len([s for s in statuses if s == 200])}")
print(f"  Error Rate              : {error_rate:.2f}%")
print(f"  Average Latency         : {avg_lat:.2f} ms")
print(f"  p50 Latency             : {p50:.2f} ms")
print(f"  p95 Latency             : {p95:.2f} ms")

print("\n--- Testing Chaos Recovery & Cache Invalidation ---")
inv = requests.post(f"{admin_url}/cache/invalidate", headers=headers).json()
print(f"  Cache Invalidation Status: {inv['message']}")

print("======================================================================")
