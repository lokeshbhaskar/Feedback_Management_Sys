from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session  # type: ignore

from app.controllers.team_member_controllers import (
    add_team_member_controller,
    get_team_members_controller,
    remove_team_member_controller,
    update_team_member_role_controller,
)
from app.database.postgresql import get_db
from app.dependencies.auth import get_current_user
from app.schemas.team_member import (
    TeamMemberCreate,
    TeamMemberDeleteResponse,
    TeamMemberResponse,
    TeamMemberRoleUpdate,
)

router = APIRouter(prefix="/team", tags=["Team"])


@router.get("/members", response_model=list[TeamMemberResponse])
def list_team_members(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_team_members_controller(db, current_user.company_id)


@router.post("/invite", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
def invite_team_member(
    data: TeamMemberCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return add_team_member_controller(db, current_user.company_id, data)


@router.patch("/members/{member_id}/role", response_model=TeamMemberResponse)
def change_team_member_role(
    member_id: int,
    payload: TeamMemberRoleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return update_team_member_role_controller(
        db,
        current_user.company_id,
        member_id,
        payload.role,
    )


@router.delete("/members/{member_id}", response_model=TeamMemberDeleteResponse)
def delete_team_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return remove_team_member_controller(
        db,
        current_user.company_id,
        member_id,
        current_user.id,
    )
