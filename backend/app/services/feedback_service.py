from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.feedback import Feedback


class FeedbackService:

    def __init__(self, db: Session):
        self.db = db

    # -----------------------------
    # Internal Helper Methods
    # -----------------------------

    def _parse(self, feedback: Feedback) -> dict:
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

    def _compose(self, parsed: dict) -> str:
        parts = [f"Category: {parsed.get('category', 'General')}"]

        if parsed.get("name"):
            parts.append(f"Name: {parsed['name']}")

        if parsed.get("email"):
            parts.append(f"Email: {parsed['email']}")

        parts.append(
            f"Archived: {'true' if parsed.get('archived') else 'false'}"
        )

        if parsed.get("reply_text"):
            parts.append(f"Reply: {parsed['reply_text']}")

        return f"[{' | '.join(parts)}]\n{parsed.get('message', '').strip()}"

    # -----------------------------
    # Public Methods
    # -----------------------------

    def _create_feedback_record(
        self,
        company_id: int,
        name: str | None,
        email: str | None,
        category: str,
        rating: int,
        message: str,
        api_key_id: int | None = None,
    ):
        details = [f"Category: {category}", "Archived: false"]

        if name:
            details.append(f"Name: {name}")

        if email:
            details.append(f"Email: {email}")

        composed_message = f"[{' | '.join(details)}]\n{message}"

        feedback = Feedback(
            message=composed_message,
            rating=rating,
            company_id=company_id,
            api_key_id=api_key_id,
        )

        self.db.add(feedback)
        self.db.commit()
        self.db.refresh(feedback)

        parsed = self._parse(feedback)
        return {
            "id": feedback.id,
            "message": parsed["message"],
            "rating": feedback.rating,
            "company_id": feedback.company_id,
            "user_id": feedback.user_id,
            "created_at": feedback.created_at,
        }

    def create_public_feedback(self, data):
        company = self.db.query(Company).filter(
            Company.id == data.company_id
        ).first()

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found",
            )

        return self._create_feedback_record(
            company_id=data.company_id,
            name=data.name,
            email=data.email,
            category=data.category,
            rating=data.rating,
            message=data.message,
        )

    def create_ingest_feedback(self, data, api_key):
        return self._create_feedback_record(
            company_id=api_key.company_id,
            name=data.name,
            email=data.email,
            category=data.category,
            rating=data.rating,
            message=data.message,
            api_key_id=api_key.id,
        )

    def list_company_feedback(
        self,
        company_id: int,
        search: str | None = None,
        category: str | None = None,
        rating: int | None = None,
        include_archived: bool = False,
    ):
        query = self.db.query(Feedback).filter(
            Feedback.company_id == company_id
        )

        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(Feedback.message.ilike(pattern))

        if rating:
            query = query.filter(Feedback.rating == rating)

        rows = query.order_by(
            Feedback.created_at.desc()
        ).all()

        items = [self._parse(row) for row in rows]

        if category:
            items = [
                item for item in items
                if item["category"].lower() == category.lower()
            ]

        if not include_archived:
            items = [
                item for item in items
                if not item["archived"]
            ]

        return items

    def archive_feedback(self, company_id: int, feedback_id: int):
        feedback = self.db.query(Feedback).filter(
            Feedback.id == feedback_id,
            Feedback.company_id == company_id
        ).first()

        if not feedback:
            raise HTTPException(status_code=404, detail="Feedback not found")

        parsed = self._parse(feedback)
        parsed["archived"] = True

        feedback.message = self._compose(parsed)

        self.db.commit()
        self.db.refresh(feedback)

        return self._parse(feedback)

    def reply_feedback(
        self,
        company_id: int,
        feedback_id: int,
        reply_text: str
    ):
        feedback = self.db.query(Feedback).filter(
            Feedback.id == feedback_id,
            Feedback.company_id == company_id
        ).first()

        if not feedback:
            raise HTTPException(status_code=404, detail="Feedback not found")

        parsed = self._parse(feedback)
        parsed["reply_text"] = reply_text.strip()

        feedback.message = self._compose(parsed)

        self.db.commit()
        self.db.refresh(feedback)

        return self._parse(feedback)
