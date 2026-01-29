from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey # type: ignore
from sqlalchemy.orm import relationship # type: ignore
from datetime import datetime
from app.database.postgresql import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="api_keys")
    feedbacks = relationship("Feedback", back_populates="api_key")
