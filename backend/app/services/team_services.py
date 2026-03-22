import secrets

from fastapi import HTTPException, status
from sqlalchemy.orm import Session  # type: ignore

from app.models.user import User
from app.schemas.team_member import TeamMemberCreate
from app.utils.security import hash_password

ALLOWED_ROLES = {"admin", "member"}


def _serialize_member(member: User):
    return {
        "id": member.id,
        "name": member.owner_name,
        "email": member.email,
        "role": member.role,
        "company_id": member.company_id,
    }


def add_team_member(db: Session, company_id: int, data: TeamMemberCreate):
    if data.role not in ALLOWED_ROLES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")

    existing_member = db.query(User).filter(User.email == data.email).first()
    if existing_member:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    temp_password = secrets.token_urlsafe(24)
    member = User(
        owner_name=data.name,
        email=data.email,
        hashed_password=hash_password(temp_password),
        role=data.role,
        company_id=company_id,
    )

    db.add(member)
    db.commit()
    db.refresh(member)
    return _serialize_member(member)


def get_team_members(db: Session, company_id: int):
    rows = (
        db.query(User)
        .filter(User.company_id == company_id)
        .order_by(User.created_at.desc())
        .all()
    )
    return [_serialize_member(row) for row in rows]


def remove_team_member(db: Session, company_id: int, member_id: int, actor_user_id: int):
    member = (
        db.query(User)
        .filter(User.id == member_id, User.company_id == company_id)
        .first()
    )
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")

    if member.id == actor_user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot remove yourself")

    if member.role == "owner":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Owner cannot be removed")

    db.delete(member)
    db.commit()
    return {"detail": "Team member removed"}


def update_team_member_role(db: Session, company_id: int, member_id: int, new_role: str):
    if new_role not in ALLOWED_ROLES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")

    member = (
        db.query(User)
        .filter(User.id == member_id, User.company_id == company_id)
        .first()
    )
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")

    if member.role == "owner":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Owner role cannot be changed")

    member.role = new_role
    db.commit()
    db.refresh(member)
    return _serialize_member(member)
