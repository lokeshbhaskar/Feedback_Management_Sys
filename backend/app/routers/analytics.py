from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session  # type: ignore

from app.controllers.analytics_controller import get_analytics_summary_controller
from app.database.postgresql import get_db
from app.dependencies.auth import get_current_user
from app.schemas.analytics import AnalyticsSummaryResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_analytics_summary(
    range_key: str = Query(default="30d", pattern="^(7d|30d|all)$"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_analytics_summary_controller(db, current_user.company_id, range_key)
