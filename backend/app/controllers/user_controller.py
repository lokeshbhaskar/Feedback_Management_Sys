from sqlalchemy.orm import Session # type: ignore
from app.schemas.user import UserCreate
from app.services.user_service import create_user


def signup_user_controller(data: UserCreate, db: Session):
    return create_user(db, data)
