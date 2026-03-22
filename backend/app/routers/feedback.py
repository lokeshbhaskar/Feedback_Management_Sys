import csv
import io

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session  # type: ignore

from app.controllers.feedback_controller import (
    archive_feedback_controller,
    create_ingest_feedback_controller,
    create_public_feedback_controller,
    list_company_feedback_controller,
    reply_feedback_controller,
)
from app.database.postgresql import get_db
from app.dependencies.api_key import get_current_api_key
from app.dependencies.auth import get_current_user
from app.schemas.feedback import FeedbackListItem, FeedbackResponse, ReplyRequest
from app.schemas.public import IngestFeedbackCreate, PublicFeedbackCreate

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.post("/public", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_public_feedback(data: PublicFeedbackCreate, db: Session = Depends(get_db)):
    return create_public_feedback_controller(db, data)


@router.post("/ingest", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_ingest_feedback(
    data: IngestFeedbackCreate,
    db: Session = Depends(get_db),
    current_api_key=Depends(get_current_api_key),
):
    return create_ingest_feedback_controller(db, data, current_api_key)


@router.get("", response_model=list[FeedbackListItem])
def list_feedback(
    search: str | None = None,
    category: str | None = None,
    rating: int | None = Query(default=None, ge=1, le=5),
    include_archived: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return list_company_feedback_controller(
        db=db,
        company_id=current_user.company_id,
        search=search,
        category=category,
        rating=rating,
        include_archived=include_archived,
    )


@router.patch("/{feedback_id}/archive", response_model=FeedbackListItem)
def archive_feedback(feedback_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return archive_feedback_controller(db, current_user.company_id, feedback_id)


@router.patch("/{feedback_id}/reply", response_model=FeedbackListItem)
def reply_feedback(
    feedback_id: int,
    payload: ReplyRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return reply_feedback_controller(db, current_user.company_id, feedback_id, payload)


@router.get("/export")
def export_feedback_csv(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    rows = list_company_feedback_controller(
        db=db,
        company_id=current_user.company_id,
        include_archived=True,
    )
    output = io.StringIO()
    writer = csv.DictWriter(
        output,
        fieldnames=["id", "category", "name", "email", "rating", "archived", "reply_text", "message", "created_at"],
    )
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=feedback-export.csv"},
    )
