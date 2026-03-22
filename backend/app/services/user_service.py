from sqlalchemy.orm import Session # type: ignore
from fastapi import HTTPException, status
from app.models.company import Company
from app.models.api_key import APIKey
from app.models.feedback import Feedback
from app.models.team import Team
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password, verify_password

def create_user(db: Session, data: UserCreate ):
    # checking if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400,detail="Email already registered")
    
    user = User(
        owner_name = data.owner_name,
        email= data.email,
        hashed_password= hash_password(data.password),
        company_id = data.company_id,
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def update_current_user_password(
    db: Session,
    current_user: User,
    current_password: str,
    new_password: str,
):
    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    if current_password == new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password",
        )

    current_user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(current_user)
    return {"detail": "Password updated successfully"}


def delete_current_user_account(db: Session, current_user: User):
    # Owner deletion removes whole workspace to avoid orphaned company.
    if current_user.role == "owner" and current_user.company_id:
        company_id = current_user.company_id
        db.query(Feedback).filter(Feedback.company_id == company_id).delete()
        db.query(APIKey).filter(APIKey.company_id == company_id).delete()
        db.query(Team).filter(Team.company_id == company_id).delete()
        db.query(User).filter(User.company_id == company_id).delete()
        db.query(Company).filter(Company.id == company_id).delete()
        db.commit()
        return {"detail": "Workspace and owner account deleted successfully"}

    db.delete(current_user)
    db.commit()
    return {"detail": "Account deleted successfully"}
