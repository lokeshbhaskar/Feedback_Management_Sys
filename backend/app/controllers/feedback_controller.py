from sqlalchemy.orm import Session  # type: ignore

from app.schemas.feedback import ReplyRequest
from app.schemas.public import PublicFeedbackCreate
from app.services.feedback_service import (
    archive_feedback,
    create_public_feedback,
    list_company_feedback,
    reply_feedback,
)


def create_public_feedback_controller(db: Session, data: PublicFeedbackCreate):
    return create_public_feedback(db, data)


def list_company_feedback_controller(
    db: Session,
    company_id: int,
    search: str | None = None,
    category: str | None = None,
    rating: int | None = None,
    include_archived: bool = False,
):
    return list_company_feedback(db, company_id, search, category, rating, include_archived)


def archive_feedback_controller(db: Session, company_id: int, feedback_id: int):
    return archive_feedback(db, company_id, feedback_id)


def reply_feedback_controller(
    db: Session,
    company_id: int,
    feedback_id: int,
    payload: ReplyRequest,
):
    return reply_feedback(db, company_id, feedback_id, payload.reply_text)
