from pydantic import BaseModel

class PublicFeedbackCreate(BaseModel):
    api_key: str
    message: str
    rating: int | None = None
