import sys
import os
import io
import time
import uuid
import json

# Ensure stdout supports UTF-8 on Windows CMD
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure python path includes current directory
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def log_test(name, success, details=""):
    status = "[PASS]" if success else "[FAIL]"
    print(f"{status} | {name} {f'({details})' if details else ''}")
    return success

def run_e2e_suite():
    print("=" * 80)
    print("DPR STUDIO 2026 - PRODUCTION END-TO-END VERIFICATION SUITE")
    print("=" * 80)

    results = []
    
    # ---------------------------------------------------------
    # TEST 1: System Health & Connection Readiness
    # ---------------------------------------------------------
    r = client.get("/health/live")
    results.append(log_test("GET /health/live", r.status_code == 200 and r.json().get("status") == "live", f"Status {r.status_code}"))
    
    r = client.get("/health/ready")
    results.append(log_test("GET /health/ready", r.status_code == 200 and r.json().get("status") == "ready", f"Status {r.status_code}"))

    # ---------------------------------------------------------
    # TEST 2: User Authentication & Token Generation
    # ---------------------------------------------------------
    test_email = f"e2e_test_{uuid.uuid4().hex[:6]}@example.com"
    test_password = "SecurePassword123!"
    
    # Registration
    r = client.post("/api/auth/register", json={
        "name": "E2E Test Enterprise",
        "email": test_email,
        "password": test_password,
        "company": "Mahalaxmi Precision Engineering",
        "phone": "+919876543210",
        "role": "PROMOTER"
    })
    reg_data = r.json()
    reg_ok = r.status_code == 201 and bool(reg_data.get("token") or reg_data.get("access_token"))
    results.append(log_test("POST /api/auth/register", reg_ok, f"User {test_email} created with token"))
    
    # Login
    r = client.post("/api/auth/login", json={"email": test_email, "password": test_password})
    login_data = r.json()
    token = login_data.get("token") or login_data.get("access_token")
    login_ok = r.status_code == 200 and bool(token)
    results.append(log_test("POST /api/auth/login", login_ok, "JWT Token acquired"))

    auth_headers = {"Authorization": f"Bearer {token}"} if token else {}

    # Invalid Login Rejection Test
    r = client.post("/api/auth/login", json={"email": test_email, "password": "WrongPassword"})
    results.append(log_test("POST /api/auth/login Security Rejection", r.status_code == 401, "Invalid password rejected"))

    # ---------------------------------------------------------
    # TEST 3: Master Sector & Blueprint Resolution
    # ---------------------------------------------------------
    r = client.get("/api/dpr/master/sectors")
    sec_data = r.json()
    results.append(log_test("GET /api/dpr/master/sectors", r.status_code == 200 and "sectors" in sec_data, f"{len(sec_data.get('sectors', []))} Sectors retrieved"))

    r = client.get("/api/dpr/master/project-types")
    results.append(log_test("GET /api/dpr/master/project-types", r.status_code == 200, "Project Types retrieved"))

    r = client.get("/api/dpr/master/blueprints/resolve?dpr_type=Bank%20Loan%20DPR&sector_id=manufacturing&activity_id=cnc_machining")
    results.append(log_test("GET /api/dpr/master/blueprints/resolve", r.status_code == 200, "Blueprint resolved"))

    # ---------------------------------------------------------
    # TEST 4: Optimized Image Upload (PIL Optimization)
    # ---------------------------------------------------------
    # Create a test synthetic 200x200 PNG image
    from PIL import Image
    img_byte_arr = io.BytesIO()
    test_img = Image.new('RGB', (400, 400), color=(15, 23, 42))
    test_img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    files = {'image': ('test_logo.png', img_byte_arr.getvalue(), 'image/png')}
    r = client.post("/api/dpr/upload-image", files=files)
    upload_res = r.json()
    uploaded_logo_url = upload_res.get("url")
    results.append(log_test("POST /api/dpr/upload-image", r.status_code == 200 and bool(uploaded_logo_url), f"Uploaded URL: {uploaded_logo_url}"))

    # ---------------------------------------------------------
    # TEST 5: Balance Sheet Upload & Parsing
    # ---------------------------------------------------------
    csv_content = "Year,Sales,Profit,NetWorth\n2024,12000000,1800000,4500000\n2025,15000000,2400000,5800000\n"
    files = {'file': ('balance_sheet.csv', csv_content.encode('utf-8'), 'text/csv')}
    r = client.post("/api/dpr/upload-balance-sheet", files=files)
    results.append(log_test("POST /api/dpr/upload-balance-sheet", r.status_code == 200, "Balance sheet parsed"))

    # ---------------------------------------------------------
    # TEST 6: Draft Auto-Save & Draft Auto-Restore
    # ---------------------------------------------------------
    save_payload = {
        "dpr_type": "Bank Loan DPR",
        "business_name": "Mahalaxmi Precision CNC Tech",
        "sector_id": "manufacturing",
        "activity_id": "cnc_machining",
        "contact_name": "Ramesh Kumar",
        "email": test_email,
        "total_cost": 4850000,
        "bank_loan": 3600000,
        "promoter_contribution": 1250000,
        "logo_path": uploaded_logo_url,
        "activeStep": 4
    }
    r = client.post("/api/dpr/save", json=save_payload, headers=auth_headers)
    results.append(log_test("POST /api/dpr/save", r.status_code == 200 and r.json().get("success") == True, "Draft saved bound to user_id"))

    r = client.get("/api/dpr/latest-draft", headers=auth_headers)
    latest_data = r.json()
    draft_ok = r.status_code == 200 and latest_data.get("has_draft") == True and latest_data.get("business_name") == "Mahalaxmi Precision CNC Tech"
    results.append(log_test("GET /api/dpr/latest-draft", draft_ok, f"Restored activeStep {latest_data.get('data', {}).get('activeStep')}"))

    r = client.get("/api/dpr/my-dprs", headers=auth_headers)
    my_dprs = r.json()
    results.append(log_test("GET /api/dpr/my-dprs", r.status_code == 200 and isinstance(my_dprs, list) and len(my_dprs) >= 1, f"Found {len(my_dprs)} submissions"))

    # ---------------------------------------------------------
    # TEST 7: MUDRA Scheme Validation Engine
    # ---------------------------------------------------------
    r = client.post("/api/mudra/category-check", json={"requested_loan": 800000})
    mudra_res = r.json().get("mudra_category", {})
    results.append(log_test("POST /api/mudra/category-check", r.status_code == 200 and mudra_res.get("category") == "TARUN", f"Category: {mudra_res.get('category')}"))

    # ---------------------------------------------------------
    # TEST 8: Full Playwright PDF Document Generation & Integrity
    # ---------------------------------------------------------
    print("  Generating complete publication-ready PDF report...")
    start_time = time.time()
    pdf_payload = {
        "dpr_type": "Bank Loan DPR",
        "business_name": "Mahalaxmi Precision CNC Tech",
        "group_name": "Mahalaxmi JLG Group",
        "primary_product": "High-Precision CNC Automotive Parts",
        "entity_type": "Proprietorship",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "contact_name": "Ramesh Kumar",
        "contact_number": "+919876543210",
        "email": test_email,
        "total_cost": 4850000,
        "bank_loan": 3600000,
        "promoter_contribution": 1250000,
        "user_logo_b64": uploaded_logo_url,
        "members": [
            {"name": "Ramesh Kumar", "designation": "Proprietor", "gender": "Male", "age": "38", "qualification": "B.E. Mechanical", "experience": "14 Years"},
            {"name": "Suresh Gowda", "designation": "Production Manager", "gender": "Male", "age": "41", "qualification": "Diploma Mech", "experience": "18 Years"}
        ],
        "machinery": [
            {"id": "1", "name": "3-Axis CNC Turning Center", "quantity": 2, "price": 1200000, "total": 2400000},
            {"id": "2", "name": "Vertical Machining Center (VMC)", "quantity": 1, "price": 1800000, "total": 1800000}
        ]
    }
    
    r = client.post("/api/dpr/generate-pdf", json=pdf_payload, headers=auth_headers)
    gen_time = time.time() - start_time
    
    pdf_bytes = r.content
    pdf_valid = r.status_code == 200 and pdf_bytes.startswith(b"%PDF") and len(pdf_bytes) > 50000
    results.append(log_test("POST /api/dpr/generate-pdf", pdf_valid, f"PDF Size: {len(pdf_bytes)/1024:.1f} KB, Time: {gen_time:.2f}s"))

    # ---------------------------------------------------------
    # FINAL SUMMARY REPORT
    # ---------------------------------------------------------
    print("=" * 80)
    passed_count = sum(1 for r in results if r)
    total_count = len(results)
    pass_rate = (passed_count / total_count) * 100
    print(f"SUMMARY RESULT: {passed_count}/{total_count} Tests Passed ({pass_rate:.1f}%)")
    print("=" * 80)
    
    if passed_count == total_count:
        print("🎉 ALL PRODUCTION E2E TESTS PASSED PERFECTLY!")
        return 0
    else:
        print("⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS.")
        return 1

if __name__ == "__main__":
    sys.exit(run_e2e_suite())
