from sqlalchemy import Column, Integer, String, DateTime, ForeignKey # type: ignore
from sqlalchemy.orm import relationship # type: ignore
from datetime import datetime
from app.database.postgresql import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="users")
    feedbacks = relationship("Feedback", back_populates="user")
