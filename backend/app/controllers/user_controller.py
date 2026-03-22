from sqlalchemy.orm import Session # type: ignore
from app.schemas.user import UserCreate
from app.services.user_service import (
    create_user,
    delete_current_user_account,
    update_current_user_password,
)


def signup_user_controller(data: UserCreate, db: Session):
    return create_user(db, data)


def update_password_controller(db: Session, current_user, current_password: str, new_password: str):
    return update_current_user_password(db, current_user, current_password, new_password)


def delete_account_controller(db: Session, current_user):
    return delete_current_user_account(db, current_user)
