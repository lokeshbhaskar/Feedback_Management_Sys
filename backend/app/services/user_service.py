from sqlalchemy.orm import Session # type: ignore
from fastapi import HTTPException
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password

def create_user(db: Session, data: UserCreate ):
    # checking if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400,detail="Email already registered")
    
    user = User(
        email= data.email,
        hashed_password= hash_password(data.password),
        company_id = data.company_id,
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user