from fastapi import HTTPException, status
from sqlalchemy.orm import Session  # type: ignore
from sqlalchemy import or_  # type: ignore

from app.models.company import Company
from app.models.feedback import Feedback


def _parse_feedback(feedback: Feedback):
    metadata = {}
    body = feedback.message or ""
    if body.startswith("[") and "]" in body:
        first_line, _, remainder = body.partition("\n")
        meta_part = first_line[1:first_line.find("]")]
        for token in meta_part.split("|"):
            chunk = token.strip()
            if ":" not in chunk:
                continue
            key, value = chunk.split(":", 1)
            metadata[key.strip().lower()] = value.strip()
        body = remainder
    return {
        "id": feedback.id,
        "category": metadata.get("category", "General"),
        "name": metadata.get("name"),
        "email": metadata.get("email"),
        "message": body.strip(),
        "rating": feedback.rating,
        "archived": metadata.get("archived", "false").lower() == "true",
        "reply_text": metadata.get("reply"),
        "created_at": feedback.created_at,
    }


def _compose_message(parsed: dict):
    parts = [f"Category: {parsed.get('category', 'General')}"]
    if parsed.get("name"):
        parts.append(f"Name: {parsed['name']}")
    if parsed.get("email"):
        parts.append(f"Email: {parsed['email']}")
    parts.append(f"Archived: {'true' if parsed.get('archived') else 'false'}")
    if parsed.get("reply_text"):
        parts.append(f"Reply: {parsed['reply_text']}")
    return f"[{' | '.join(parts)}]\n{parsed.get('message', '').strip()}"


def create_public_feedback(db: Session, data):
    company = db.query(Company).filter(Company.id == data.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    # Keep metadata available without requiring a schema migration yet.
    details = [f"Category: {data.category}", "Archived: false"]
    if data.name:
        details.append(f"Name: {data.name}")
    if data.email:
        details.append(f"Email: {data.email}")
    composed_message = f"[{ ' | '.join(details) }]\n{data.message}"

    feedback = Feedback(
        message=composed_message,
        rating=data.rating,
        company_id=data.company_id,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def list_company_feedback(
    db: Session,
    company_id: int,
    search: str | None = None,
    category: str | None = None,
    rating: int | None = None,
    include_archived: bool = False,
):
    query = db.query(Feedback).filter(Feedback.company_id == company_id)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter(or_(Feedback.message.ilike(pattern)))
    if rating:
        query = query.filter(Feedback.rating == rating)

    rows = query.order_by(Feedback.created_at.desc()).all()
    items = [_parse_feedback(row) for row in rows]

    if category:
        items = [item for item in items if item["category"].lower() == category.lower()]
    if not include_archived:
        items = [item for item in items if not item["archived"]]
    return items


def archive_feedback(db: Session, company_id: int, feedback_id: int):
    feedback = (
        db.query(Feedback)
        .filter(Feedback.id == feedback_id, Feedback.company_id == company_id)
        .first()
    )
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    parsed = _parse_feedback(feedback)
    parsed["archived"] = True
    feedback.message = _compose_message(parsed)
    db.commit()
    db.refresh(feedback)
    return _parse_feedback(feedback)


def reply_feedback(db: Session, company_id: int, feedback_id: int, reply_text: str):
    feedback = (
        db.query(Feedback)
        .filter(Feedback.id == feedback_id, Feedback.company_id == company_id)
        .first()
    )
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    parsed = _parse_feedback(feedback)
    parsed["reply_text"] = reply_text.strip()
    feedback.message = _compose_message(parsed)
    db.commit()
    db.refresh(feedback)
    return _parse_feedback(feedback)
