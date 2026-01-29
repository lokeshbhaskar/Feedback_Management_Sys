from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company_id: int

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True
