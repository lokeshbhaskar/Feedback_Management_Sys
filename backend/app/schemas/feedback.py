from pydantic import BaseModel, Field
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


class FeedbackListItem(BaseModel):
    id: int
    category: str
    name: str | None = None
    email: str | None = None
    message: str
    rating: int | None = None
    archived: bool = False
    reply_text: str | None = None
    created_at: datetime


class ReplyRequest(BaseModel):
    reply_text: str = Field(..., min_length=1)
