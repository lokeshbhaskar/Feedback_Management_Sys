import os
import sys
import unittest
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ.setdefault("JWT_SECRET", "test-secret-key")
sys.path.insert(0, "backend")

from app.controllers.auth_controller import get_me_controller
from app.database.postgresql import Base
from app.models.company import Company
from app.models.user import User
from app.schemas.auth import OwnerSignupRequest
from app.services.auth_service import authenticate_user, owner_signup_service

# Ensure all relationship targets are registered with SQLAlchemy metadata.
import app.models.api_key  # noqa: F401,E402
import app.models.feedback  # noqa: F401,E402


class AuthServiceTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        Base.metadata.create_all(bind=self.engine)
        self.db = TestingSessionLocal()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_owner_signup_creates_company_and_owner_name(self):
        request = OwnerSignupRequest(
            owner_name="Alice Owner",
            company_name="Acme",
            email="alice@example.com",
            password="secret123",
        )

        user = owner_signup_service(self.db, request)

        self.assertEqual(user.owner_name, "Alice Owner")
        self.assertEqual(user.role, "owner")
        self.assertIsNotNone(user.company_id)

        company = self.db.query(Company).filter(Company.id == user.company_id).first()
        self.assertIsNotNone(company)
        self.assertEqual(company.name, "Acme")

    def test_owner_signup_duplicate_email_raises_400(self):
        existing_company = Company(name="Existing Co", created_at=datetime.utcnow())
        self.db.add(existing_company)
        self.db.flush()
        self.db.add(
            User(
                owner_name="Existing Owner",
                email="dup@example.com",
                hashed_password="hash",
                role="owner",
                company_id=existing_company.id,
            )
        )
        self.db.commit()

        request = OwnerSignupRequest(
            owner_name="New Owner",
            company_name="New Co",
            email="dup@example.com",
            password="secret123",
        )

        with self.assertRaises(HTTPException) as context:
            owner_signup_service(self.db, request)

        self.assertEqual(context.exception.status_code, 400)
        self.assertEqual(context.exception.detail, "Email already registered")

    def test_authenticate_user_success_returns_bearer_token(self):
        request = OwnerSignupRequest(
            owner_name="Bob Owner",
            company_name="Beta Co",
            email="bob@example.com",
            password="password123",
        )
        owner_signup_service(self.db, request)

        token_data = authenticate_user(self.db, "bob@example.com", "password123")

        self.assertIn("access_token", token_data)
        self.assertEqual(token_data["token_type"], "bearer")

    def test_authenticate_user_invalid_password_raises_401(self):
        request = OwnerSignupRequest(
            owner_name="Cara Owner",
            company_name="Gamma Co",
            email="cara@example.com",
            password="password123",
        )
        owner_signup_service(self.db, request)

        with self.assertRaises(HTTPException) as context:
            authenticate_user(self.db, "cara@example.com", "wrong-password")

        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Invalid credentials")

    def test_get_me_controller_returns_nested_company(self):
        request = OwnerSignupRequest(
            owner_name="Dan Owner",
            company_name="Delta Co",
            email="dan@example.com",
            password="password123",
        )
        user = owner_signup_service(self.db, request)
        self.db.refresh(user)

        payload = get_me_controller(user)

        self.assertEqual(payload["email"], "dan@example.com")
        self.assertEqual(payload["owner_name"], "Dan Owner")
        self.assertEqual(payload["role"], "owner")
        self.assertEqual(payload["company"]["name"], "Delta Co")


if __name__ == "__main__":
    unittest.main()
