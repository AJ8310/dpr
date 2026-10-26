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
    DPR_REPORT_PRICE: float = float(os.getenv("DPR_REPORT_PRICE", 799.0))
    
    # Gemini AI (Optional)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # SMTP / Email Configuration
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "") or os.getenv("SMTP_PASS", "")
    SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME", "Vision Karnataka Foundation (VKF) DPR Studio")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "") or os.getenv("SMTP_USER", "")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() in ["true", "1", "yes"]
    SMTP_USE_SSL: bool = (os.getenv("SMTP_USE_SSL", "false").lower() in ["true", "1", "yes"]) or (os.getenv("SMTP_SECURE", "false").lower() in ["true", "1", "yes"])
    
    # Allowed CORS Origins
    CORS_ORIGINS: list[str] = [
        o.strip().strip("[]\"'") for o in os.getenv(
            "CORS_ORIGINS",
            "https://dpr.vkfoundations.org,"
            "https://vkfoundations.org,"
            "http://dpr.vkfoundations.org,"
            "http://vkfoundations.org,"
            "https://dpr-frontend-badcf.web.app,"
            "https://dpr-frontend-badcf.firebaseapp.com,"
            "https://dpr.vkfoundations.org,"
            "https://www.dpr.vkfoundations.org,"
            "http://localhost:3000,http://127.0.0.1:3000,"
            "http://localhost:3005,http://127.0.0.1:3005,"
            "http://localhost:5000,http://127.0.0.1:5000,"
            "http://localhost:5500,http://127.0.0.1:5500",
        ).split(",") if o.strip()
    ]

settings = Settings()
