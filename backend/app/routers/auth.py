from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session # type: ignore
from app.database.postgresql import get_db
from app.schemas.auth import LoginRequest, OwnerSignupRequest, OwnerSignupResponse, TokenResponse
from app.controllers.auth_controller import login_controller, owner_signup_controller

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post(
    "/signup",
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
     
