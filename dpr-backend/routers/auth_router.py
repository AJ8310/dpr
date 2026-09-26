import uuid
import bcrypt
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models.database_models import UserDB
from models.auth_models import UserRegister, UserLogin, UserResponse, Token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

VALID_ROLES = {"ADMIN", "PROMOTER", "REVIEWER", "SUPER_ADMIN"}

def hash_password(password: str) -> str:
    try:
        pwd_bytes = password.encode('utf-8')[:72]
        salt = bcrypt.gensalt(rounds=10)
        return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
    except Exception:
        return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            return False

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user_obj(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserDB:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token.")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials.")

    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")
    return user

def require_roles(allowed_roles: List[str]):
    def role_checker(user: UserDB = Depends(get_current_user_obj)):
        if user.role not in allowed_roles and "SUPER_ADMIN" not in user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {allowed_roles}, Current role: {user.role}"
            )
        return user
    return role_checker

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    existing = db.query(UserDB).filter(UserDB.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    assigned_role = payload.role.upper().strip() if payload.role and payload.role.upper().strip() in VALID_ROLES else "PROMOTER"
    hashed_pwd = hash_password(payload.password)
    
    user = UserDB(
        name=payload.name,
        email=email,
        hashed_password=hashed_pwd,
        role=assigned_role,
        company=payload.company,
        phone=payload.phone,
        service_type=payload.service_type or "Bank Loan DPR",
        last_login_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    
    token = create_access_token({"sub": user.id, "email": email, "role": user.role})
    user_resp = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        company=user.company,
        phone=user.phone,
        service_type=user.service_type
    )
    return Token(access_token=token, token_type="bearer", user=user_resp)

@router.post("/login", response_model=Token)
async def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    user.last_login_at = datetime.utcnow()
    db.commit()

    token = create_access_token({"sub": user.id, "email": email, "role": user.role})
    user_resp = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        company=user.company,
        phone=user.phone,
        service_type=user.service_type
    )
    return Token(access_token=token, token_type="bearer", user=user_resp)

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(user: UserDB = Depends(get_current_user_obj)):
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        company=user.company,
        phone=user.phone,
        service_type=user.service_type
    )

@router.get("/users", dependencies=[Depends(require_roles(["ADMIN", "SUPER_ADMIN"]))])
async def list_users(db: Session = Depends(get_db)):
    users = db.query(UserDB).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "company": u.company,
            "phone": u.phone,
            "service_type": u.service_type,
            "created_at": u.created_at,
            "last_login_at": u.last_login_at
        } for u in users
    ]
