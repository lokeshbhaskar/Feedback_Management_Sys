from pydantic import BaseModel, EmailStr, Field

class OwnerSignupRequest(BaseModel):
    company_name: str = Field(...,min_length=3)
    email: EmailStr
    password: str = Field(...,min_length=4)

class OwnerSignupResponse(BaseModel):
    id: int
    email: EmailStr
    company_id: int
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
