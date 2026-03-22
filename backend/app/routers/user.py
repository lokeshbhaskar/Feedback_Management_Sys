from fastapi import APIRouter, Depends
from app.controllers.user_controller import (
    delete_account_controller,
    signup_user_controller,
    update_password_controller,
)
from app.dependencies.auth import get_current_user
from sqlalchemy.orm import Session # type: ignore
from app.database.postgresql import get_db
from app.schemas.user import BasicMessageResponse, UpdatePasswordRequest, UserCreate, UserResponse

# router = APIRouter()

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/signup", response_model=UserResponse)
def signup(data: UserCreate, db: Session = Depends(get_db)):
    return signup_user_controller(data, db)


@router.patch("/me/password", response_model=BasicMessageResponse)
def update_password(
    payload: UpdatePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return update_password_controller(db, current_user, payload.current_password, payload.new_password)


@router.delete("/me", response_model=BasicMessageResponse)
def delete_account(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return delete_account_controller(db, current_user)
