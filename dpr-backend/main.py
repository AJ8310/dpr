import os, datetime
from sqlalchemy import text
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from database import engine, Base
import models.database_models  # Ensure models are registered
from middleware.observability import RequestTracingMiddleware
from middleware.security import HTTPSecurityHeadersMiddleware
from routers import auth_router, dpr_router, assistant_router, payment_router, document_router, dpr_engine_router, dpr_blueprint_router, dpr_question_router, dpr_financial_router, dpr_agent_router, dpr_intelligence_router, dpr_content_router, dpr_document_compiler_router, admin_router, master_data_router, mudra_router

from fastapi.responses import JSONResponse
from fastapi import Request

# Create database tables automatically
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Database table initialization notice: {e}")

app = FastAPI(
    title="Vision Karnataka Foundation DPR Studio API",
    description="High-Performance Python FastAPI Backend for DPR Studio 2026",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[ERROR] Unhandled Exception on {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "detail": "An internal server error occurred. Please try again or contact support."}
    )

app.add_middleware(RequestTracingMiddleware)
app.add_middleware(HTTPSecurityHeadersMiddleware)

# Phase 1A Security Hardening: Strict CORS Origins Whitelist
allowed_origins = settings.CORS_ORIGINS if hasattr(settings, "CORS_ORIGINS") else [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount Static Files Directory for Uploads
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Register API Routers
app.include_router(auth_router.router)
app.include_router(dpr_router.router)
app.include_router(assistant_router.router)
app.include_router(payment_router.router)
app.include_router(document_router.router)
app.include_router(dpr_engine_router.router)
app.include_router(dpr_blueprint_router.router)
app.include_router(dpr_question_router.router)
app.include_router(dpr_financial_router.router)
app.include_router(dpr_agent_router.router)
app.include_router(dpr_intelligence_router.router)
app.include_router(dpr_content_router.router)
app.include_router(dpr_document_compiler_router.router)
app.include_router(admin_router.router)
app.include_router(master_data_router.router)
app.include_router(mudra_router.router)

@app.get("/health/live")
async def health_live():
    return {"status": "live", "timestamp": datetime.datetime.now().isoformat()}

@app.get("/health/ready")
async def health_ready():
    # Verify database connection readiness
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "ready" if db_status == "connected" else "degraded",
        "database": db_status,
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Vision Karnataka Foundation DPR Studio API",
        "docs": "/docs",
        "health": "/api/dpr/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
