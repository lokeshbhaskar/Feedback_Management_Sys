from sqlalchemy.orm import Session  # type: ignore

from app.schemas.feedback import ReplyRequest
from app.schemas.public import IngestFeedbackCreate, PublicFeedbackCreate
from app.services.feedback_service import FeedbackService


def create_public_feedback_controller(db: Session, data: PublicFeedbackCreate):
    service = FeedbackService(db)
    return service.create_public_feedback(data)


def create_ingest_feedback_controller(db: Session, data: IngestFeedbackCreate, api_key):
    service = FeedbackService(db)
    return service.create_ingest_feedback(data, api_key)


def list_company_feedback_controller(
    db: Session,
    company_id: int,
    search: str | None = None,
    category: str | None = None,
    rating: int | None = None,
    include_archived: bool = False,
):
    service = FeedbackService(db)
    return service.list_company_feedback(company_id, search, category, rating, include_archived)


def archive_feedback_controller(db: Session, company_id: int, feedback_id: int):
    service = FeedbackService(db)
    return service.archive_feedback(company_id, feedback_id)


def reply_feedback_controller(
    db: Session,
    company_id: int,
    feedback_id: int,
    payload: ReplyRequest,
):
    service = FeedbackService(db)
    return service.reply_feedback(company_id, feedback_id, payload.reply_text)
