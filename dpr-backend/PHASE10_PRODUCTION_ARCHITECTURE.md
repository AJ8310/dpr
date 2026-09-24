# Phase 10 Production Deployment Architecture 🏗️🌐

```
                    INTERNET
                       │
                 Cloudflare WAF
                       │
             AWS Application Load Balancer
                       │
       ┌───────────────┴───────────────┐
       │                               │
FastAPI API Cluster (Replicas 1-8)   FastAPI API Cluster
       │                               │
 ┌─────┴───────────────────────────────┴─────┐
 │                                           │
Redis Cluster                      Supabase PostgreSQL
(Session & Distributed Locks)     (PgBouncer Pool)
 │                                           │
 └─────────────────────┬─────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       │                               │
Background Worker Cluster          Playwright Chromium Worker Pool
(Agents/Research/Content)         (PDF Rendering Engine)
       │                               │
       └───────────────┬───────────────┘
                       │
             AWS S3 Object Storage
```
