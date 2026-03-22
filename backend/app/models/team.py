from sqlalchemy import Column, Integer, String, ForeignKey , DateTime
from sqlalchemy.orm import relationship
from app.database.postgresql import Base
from datetime import datetime

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"))
    company = relationship("Company", back_populates="teams")

    created_at = Column(DateTime, default=datetime.utcnow)
