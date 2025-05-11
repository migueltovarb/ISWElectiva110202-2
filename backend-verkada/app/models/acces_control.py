from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class AccessControl(Base):
    __tablename__ = "access_controls"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    visitor_id = Column(Integer, ForeignKey("visitors.id"), nullable=True)
    door_id = Column(Integer, ForeignKey("doors.id"), nullable=False)
    access_granted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="access_controls")
    visitor = relationship("Visitor", back_populates="access_controls")
    door = relationship("Door", back_populates="access_controls")
