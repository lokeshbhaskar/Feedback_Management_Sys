from pydantic import BaseModel
from datetime import datetime

class FeedbackCreate(BaseModel):
    message: str
    rating: int | None = None

class FeedbackResponse(BaseModel):
    id: int
    message: str
    rating: int | None
    company_id: int
    user_id: int | None
    created_at: datetime

    class Config:
        from_attributes = True
