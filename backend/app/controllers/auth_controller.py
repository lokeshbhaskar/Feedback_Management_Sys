from sqlalchemy.orm import Session # type: ignore
from app.schemas.auth import LoginRequest, OwnerSignupRequest, TokenResponse
from app.services.auth_service import authenticate_user, owner_signup_service

def owner_signup_controller(db: Session, data: OwnerSignupRequest):
    user = owner_signup_service(db, data)

    return {
        "id": user.id,
        "email": user.email,
        "company_id": user.company_id,
        "role": user.role
    }


def login_controller(data: LoginRequest, db: Session):
     return authenticate_user(db, data.email, data.password)
    
