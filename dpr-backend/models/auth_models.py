from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "PROMOTER"  # ADMIN, PROMOTER, REVIEWER, SUPER_ADMIN
    phone: Optional[str] = None
    company: Optional[str] = None
    service_type: Optional[str] = "Bank Loan DPR"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str = "PROMOTER"
    company: Optional[str] = None
    phone: Optional[str] = None
    service_type: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
