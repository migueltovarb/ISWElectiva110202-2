from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Visit(Base):
    __tablename__ = "visits"

    id = Column(Integer, primary_key=True, index=True)
    visitor_id = Column(Integer, ForeignKey("visitors.id"), nullable=False)
    door_id = Column(Integer, ForeignKey("doors.id"), nullable=False)
    visit_time = Column(DateTime, default=datetime.utcnow)
    purpose = Column(String, nullable=True)

    visitor = relationship("Visitor")
    door = relationship("Door")
