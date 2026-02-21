from pydantic import BaseModel, EmailStr, Field


class PublicFeedbackCreate(BaseModel):
    company_id: int
    name: str | None = None
    email: EmailStr | None = None
    category: str = Field(..., min_length=2)
    rating: int = Field(..., ge=1, le=5)
    message: str = Field(..., min_length=5)
