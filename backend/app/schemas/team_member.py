from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class TeamMemberCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    role: Literal["admin", "member"] = "member"


class TeamMemberRoleUpdate(BaseModel):
    role: Literal["admin", "member"]


class TeamMemberResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    company_id: int

    class Config:
        from_attributes = True


class TeamMemberDeleteResponse(BaseModel):
    detail: str
