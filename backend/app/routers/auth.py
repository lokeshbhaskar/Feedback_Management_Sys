from fastapi import APIRouter, Depends, status
from app.dependencies.auth import get_current_user
from sqlalchemy.orm import Session # type: ignore
from app.database.postgresql import get_db
from app.schemas.auth import LoginRequest, MeResponse, OwnerSignupRequest, OwnerSignupResponse, TokenResponse
from app.controllers.auth_controller import get_me_controller, login_controller, owner_signup_controller

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post(
    "/signup-owner",
    response_model=OwnerSignupResponse,
    status_code=status.HTTP_201_CREATED
)
def owner_signup(
    data: OwnerSignupRequest,
    db: Session = Depends(get_db)
):
    return owner_signup_controller(db, data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_controller(data, db)
     
@router.get("/me", response_model=MeResponse)
def get_me(current_user = Depends(get_current_user)):
    return get_me_controller(current_user)
