from pydantic import BaseModel

class FeedbackAnalytics(BaseModel):
    total_feedbacks: int
    average_rating: float | None
    positive_count: int
    negative_count: int
