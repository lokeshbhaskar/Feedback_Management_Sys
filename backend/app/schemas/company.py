from pydantic import BaseModel
from datetime import datetime

class CompanyCreate(BaseModel):
    name: str
    industry: str | None = None

class CompanyResponse(BaseModel):
    id: int
    name: str
    industry: str | None
    created_at: datetime

    class Config:
        from_attributes = True
