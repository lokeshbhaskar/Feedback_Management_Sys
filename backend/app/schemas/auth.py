from pydantic import BaseModel, EmailStr, Field

class OwnerSignupRequest(BaseModel):
    owner_name: str = Field(...,min_length=3)
    company_name: str = Field(...,min_length=3)
    email: EmailStr
    password: str = Field(...,min_length=4)

class OwnerSignupResponse(BaseModel):
    id: int
    owner_name: str
    email: EmailStr
    role: str = "owner"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


from pydantic import BaseModel, EmailStr

class CompanyResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class MeResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    company: CompanyResponse

    class Config:
        from_attributes = True
