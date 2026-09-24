# Phase 9 Capacity Model & 10,000 User Breakdown 📊🚀

## 1. 10,000 Concurrent User Workload Distribution
10,000 concurrent authenticated sessions represent realistic user activity classes:

| Activity Class | Concurrent Users | % of Active Sessions | Target Latency SLO | Operational Mode |
| :--- | :---: | :---: | :---: | :---: |
| **Dashboard / Navigation** | 5,000 | 50.0% | p95 < 250ms | Synchronous GET |
| **Form Filling & Autosave** | 2,000 | 20.0% | p95 < 500ms | Debounced POST (3s) |
| **Financial Calculations** | 500 | 5.0% | p95 < 1,000ms | Synchronous POST |
| **AI Agent Tasks** | 250 | 2.5% | Async Queue | Asynchronous Worker |
| **Research Queries** | 100 | 1.0% | Async Queue | Asynchronous + TTL Cache |
| **Content Generations** | 100 | 1.0% | Async Queue | Asynchronous Worker |
| **Document Compilations** | 50 | 0.5% | Async Queue | Asynchronous Worker |
| **Simultaneous PDF Renders**| 25 | 0.25% | < 6.0s / PDF | Warm Playwright Pool |
| **Idle / Passive Sessions** | 1,975 | 19.75% | N/A | Session Token Valid |

---

## 2. Infrastructure Capacity Requirements
- **API Worker Replicas**: 4–8 FastAPI Uvicorn replicas (gunicorn/uvicorn workers).
- **PostgreSQL Database Pool**: 20 persistent connections per replica × 4 replicas = 80 pool connections (supported by Supabase PgBouncer/PostgreSQL).
- **Playwright PDF Worker Pool**: Max 25 concurrent Chromium page contexts (utilizing ~1.2 GB RAM).
