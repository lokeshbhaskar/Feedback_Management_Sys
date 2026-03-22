import sys
import unittest
from datetime import datetime, timedelta
from types import SimpleNamespace

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, "backend")

from app.database.postgresql import Base
from app.models.company import Company
from app.models.user import User
from app.services.feedback_service import FeedbackService
from app.utils.security import hash_password

# Ensure relationship targets are registered.
import app.models.api_key  # noqa: F401,E402
import app.models.feedback  # noqa: F401,E402
import app.models.team  # noqa: F401,E402


class FeedbackServiceTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        Base.metadata.create_all(bind=self.engine)
        self.db = SessionLocal()

        company = Company(name="Acme", created_at=datetime.utcnow())
        self.db.add(company)
        self.db.flush()
        self.company_id = company.id

        owner = User(
            owner_name="Owner",
            email="owner@acme.com",
            hashed_password=hash_password("secret123"),
            role="owner",
            company_id=self.company_id,
        )
        self.db.add(owner)
        self.db.commit()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_create_public_feedback_returns_clean_message(self):
        service = FeedbackService(self.db)
        payload = SimpleNamespace(
            company_id=self.company_id,
            name="Alice",
            email="alice@example.com",
            category="Support",
            rating=5,
            message="Great support team",
        )
        result = service.create_public_feedback(payload)
        self.assertEqual(result["company_id"], self.company_id)
        self.assertEqual(result["message"], "Great support team")
        self.assertEqual(result["rating"], 5)

    def test_list_archive_and_reply_feedback(self):
        service = FeedbackService(self.db)
        payload = SimpleNamespace(
            company_id=self.company_id,
            name="Bob",
            email="bob@example.com",
            category="Feature Request",
            rating=4,
            message="Please add dark mode",
        )
        created = service.create_public_feedback(payload)

        listed = service.list_company_feedback(self.company_id)
        self.assertEqual(len(listed), 1)
        self.assertEqual(listed[0]["category"], "Feature Request")
        self.assertFalse(listed[0]["archived"])

        archived = service.archive_feedback(self.company_id, created["id"])
        self.assertTrue(archived["archived"])

        replied = service.reply_feedback(self.company_id, created["id"], "Thanks, noted.")
        self.assertEqual(replied["reply_text"], "Thanks, noted.")

        active_list = service.list_company_feedback(self.company_id, include_archived=False)
        self.assertEqual(len(active_list), 0)
        all_list = service.list_company_feedback(self.company_id, include_archived=True)
        self.assertEqual(len(all_list), 1)


if __name__ == "__main__":
    unittest.main()
