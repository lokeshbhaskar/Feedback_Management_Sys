import sys
import unittest
from datetime import datetime, timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, "backend")

from app.database.postgresql import Base
from app.models.company import Company
from app.models.feedback import Feedback
from app.services.analytics_service import get_analytics_summary

# Ensure relationship targets are registered.
import app.models.api_key  # noqa: F401,E402
import app.models.team  # noqa: F401,E402
import app.models.user  # noqa: F401,E402


class AnalyticsServiceTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        Base.metadata.create_all(bind=self.engine)
        self.db = SessionLocal()

        company = Company(name="Beta", created_at=datetime.utcnow())
        self.db.add(company)
        self.db.flush()
        self.company_id = company.id

        now = datetime.utcnow()
        rows = [
            Feedback(
                company_id=self.company_id,
                rating=5,
                message="[Category: Support | Archived: false | Reply: Thanks]\nGreat help",
                created_at=now - timedelta(days=1),
            ),
            Feedback(
                company_id=self.company_id,
                rating=3,
                message="[Category: Bug | Archived: true]\nNeeds fix",
                created_at=now - timedelta(days=2),
            ),
            Feedback(
                company_id=self.company_id,
                rating=4,
                message="[Category: Feature Request | Archived: false]\nPlease add export",
                created_at=now - timedelta(days=20),
            ),
        ]
        self.db.add_all(rows)
        self.db.commit()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_summary_for_7_days(self):
        summary = get_analytics_summary(self.db, self.company_id, "7d")
        self.assertEqual(summary["total"], 2)
        self.assertEqual(summary["archived"], 1)
        self.assertEqual(summary["response_rate"], 50)
        self.assertEqual(summary["avg_rating"], 4.0)

    def test_summary_for_all_time(self):
        summary = get_analytics_summary(self.db, self.company_id, "all")
        self.assertEqual(summary["total"], 3)
        self.assertEqual(summary["archived"], 1)
        self.assertTrue(any(item["category"] == "Support" for item in summary["categories"]))
        self.assertEqual(len(summary["ratings"]), 5)


if __name__ == "__main__":
    unittest.main()
