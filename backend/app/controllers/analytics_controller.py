from sqlalchemy.orm import Session  # type: ignore

from app.services.analytics_service import get_analytics_summary


def get_analytics_summary_controller(db: Session, company_id: int, range_key: str):
    return get_analytics_summary(db, company_id, range_key)
