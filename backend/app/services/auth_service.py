from sqlalchemy.orm import Session   # type: ignore
from fastapi import HTTPException,status
from app.models.user import User
from app.models.company import Company
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token
from datetime import datetime

def owner_signup_service(db:Session, data):
     # 1. Check if email already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        # 2 Create company
        company = Company(
            name=data.company_name,
            created_at=datetime.utcnow()
        )
        db.add(company)
        db.flush()  # needed to get company.id

        # 3 Create owner user
        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            role="owner",
            company_id=company.id,
            created_at=datetime.utcnow()
        )
        db.add(user)

        # 4 Commit transaction
        db.commit()
        db.refresh(user)

        return user

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Signup failed"
        )

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role,
        "company_id": user.company_id
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def get_me_service(current_user):
    return current_user