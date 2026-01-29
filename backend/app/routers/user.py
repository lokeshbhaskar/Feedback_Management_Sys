from fastapi import APIRouter, Depends
from app.controllers.user_controller import signup_user_controller
from sqlalchemy.orm import Session # type: ignore
from app.database.postgresql import get_db
from app.schemas.user import UserCreate, UserResponse

# router = APIRouter()

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/signup", response_model=UserResponse)
def signup(data: UserCreate, db: Session = Depends(get_db)):
    return signup_user_controller(data, db)