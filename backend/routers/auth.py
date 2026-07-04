from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func, or_
from sqlalchemy.orm import Session 
from models.users import User
from schemas.users import UserCreate, UserResponse
from schemas.token import Token
from database import get_db
from utils.security import hash_password, verify_password
from utils.token import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed_password = hash_password(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
async def login(request: Request, db: Session = Depends(get_db)):
    """
    OAuth2 compatible token endpoint.
    Accepts both form-data and JSON with username/email and password.
    """
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        payload = await request.json()
        username_or_email = (payload.get("username") or payload.get("email") or "").strip()
        password = (payload.get("password") or "").strip()
    else:
        form_data = await request.form()
        username_or_email = (form_data.get("username") or form_data.get("email") or "").strip()
        password = (form_data.get("password") or "").strip()

    if not username_or_email or not password:
        raise HTTPException(status_code=400, detail="Email/username and password are required")

    existing_user = db.query(User).filter(
        or_(
            func.lower(User.email) == func.lower(username_or_email),
            func.lower(User.name) == func.lower(username_or_email),
        )
    ).first()

    if not existing_user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    if not verify_password(password, existing_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": str(existing_user.id), "role": existing_user.role})
    return {"access_token": access_token, "token_type": "Bearer"}