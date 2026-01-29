from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey # type: ignore
from sqlalchemy.orm import relationship # type: ignore
from datetime import datetime
from app.database.postgresql import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)

    company_id = Column(Integer, ForeignKey("companies.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    api_key_id = Column(Integer, ForeignKey("api_keys.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="feedbacks")
    user = relationship("User", back_populates="feedbacks")
    api_key = relationship("APIKey", back_populates="feedbacks")
