from sqlalchemy import Column, Integer, String, DateTime # type: ignore
from sqlalchemy.orm import relationship # type: ignore
from datetime import datetime
from app.database.postgresql import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    industry = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="company")
    api_keys = relationship("APIKey", back_populates="company")
    feedbacks = relationship("Feedback", back_populates="company")
