from fastapi import Depends, HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from app.utils.jwt import verify_token
from app.database.postgresql import get_db
from sqlalchemy.orm import Session # type: ignore
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db) ):
    payload = verify_token(token)
    print("Payload:", payload)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORISED,
            detail="Invalid or expired token"
        )
    
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = db.query(User).filter(User.id == int(user_id)).first()

    if not user:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="user not found"
        )
    
    return user
    
     
