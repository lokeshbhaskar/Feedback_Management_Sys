from sqlalchemy.orm import Session  # type: ignore
from app.schemas.auth import LoginRequest, OwnerSignupRequest, OwnerSignupResponse
from app.services.auth_service import authenticate_user, owner_signup_service

def owner_signup_controller(db: Session, data: OwnerSignupRequest):
    user = owner_signup_service(db, data)

    return OwnerSignupResponse(
        id=user.id,
        owner_name=user.owner_name,
        email=user.email,
        role=user.role
    )


def login_controller(data: LoginRequest, db: Session):
     return authenticate_user(db, data.email, data.password)
    

def get_me_controller(current_user):
    company = None
    if current_user.company:
        company = {
            "id": current_user.company.id,
            "name": current_user.company.name,
        }

    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "company": company,
    }
