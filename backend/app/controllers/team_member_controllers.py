from sqlalchemy.orm import Session # type: ignore
from app.schemas.team_member import TeamMemberCreate
from app.services.team_services import get_team_members, add_team_member, remove_team_member,update_team_member_role


def get_team_members_controller(db: Session, company_id: int):
    return get_team_members(db, company_id)

def add_team_member_controller(db: Session, company_id: int, data: TeamMemberCreate):
    return add_team_member(db, company_id, data)

def remove_team_member_controller(db: Session, company_id: int, member_id: int, actor_user_id: int):
    return remove_team_member(db, company_id, member_id, actor_user_id)

def update_team_member_role_controller(db: Session, company_id: int, member_id: int, new_role: str):
    return update_team_member_role(db, company_id, member_id, new_role)
