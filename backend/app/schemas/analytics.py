from pydantic import BaseModel


class AnalyticsCategoryItem(BaseModel):
    category: str
    count: int


class AnalyticsRatingItem(BaseModel):
    star: int
    count: int


class AnalyticsTrendItem(BaseModel):
    date: str
    count: int


class AnalyticsSummaryResponse(BaseModel):
    total: int
    archived: int
    avg_rating: float
    response_rate: int
    categories: list[AnalyticsCategoryItem]
    ratings: list[AnalyticsRatingItem]
    trend: list[AnalyticsTrendItem]
