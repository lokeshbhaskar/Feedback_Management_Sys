from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    owner_name: str
    email: EmailStr
    password: str
    company_name: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    owner_name: str
    company_name: str
    role: str
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True
