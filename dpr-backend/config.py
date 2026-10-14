import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PORT: int = int(os.getenv("PORT", 5000))
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    
    # Razorpay
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    DPR_REPORT_PRICE: float = float(os.getenv("DPR_REPORT_PRICE", 1.0))
    
    # Gemini AI (Optional)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Allowed CORS Origins
    CORS_ORIGINS: list[str] = [
        o.strip().strip("[]\"'") for o in os.getenv(
            "CORS_ORIGINS",
            "https://detailed-project-report.web.app,"
            "https://detailed-project-report.firebaseapp.com,"
            "http://localhost:3000,http://127.0.0.1:3000,"
            "http://localhost:5500,http://127.0.0.1:5500",
        ).split(",") if o.strip()
    ]

settings = Settings()
