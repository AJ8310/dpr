from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load root .env file and local backend .env file
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root_env = os.path.join(root_dir, ".env")
backend_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

load_dotenv(backend_env, override=True)
load_dotenv(root_env, override=True)

db_url = os.getenv("DATABASE_URL", "").strip()

# Check if SUPABASE_DB_URL is present
if not db_url:
    supabase_db = os.getenv("SUPABASE_DB_URL", "").strip()
    if supabase_db:
        db_url = supabase_db

# Construct PostgreSQL URL if SUPABASE_URL and SUPABASE_DB_PASSWORD exist
if not db_url:
    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    db_pass = os.getenv("SUPABASE_DB_PASSWORD", "").strip() or os.getenv("DB_PASSWORD", "").strip()
    if supabase_url and db_pass:
        # Extract project ref from https://<ref>.supabase.co
        project_ref = supabase_url.replace("https://", "").replace("http://", "").split(".")[0]
        db_url = f"postgresql://postgres:{db_pass}@db.{project_ref}.supabase.co:5432/postgres"

if not db_url:
    db_url = "sqlite:///./dpr.db"

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

DATABASE_URL = db_url

proto = DATABASE_URL.split('://')[0] if '://' in DATABASE_URL else 'unknown'
print(f"Connecting to database protocol: {proto}")

engine_args = {}
if DATABASE_URL.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    engine_args.update({
        "pool_size": int(os.getenv("DB_POOL_SIZE", "20")),
        "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "30")),
        "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", "30")),
        "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "1800")),
        "pool_pre_ping": True
    })

engine = create_engine(DATABASE_URL, **engine_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
