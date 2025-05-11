from sqlalchemy import Column, Integer, String
from app.core.database import Base
from sqlalchemy.orm import relationship

class Door(Base):
    __tablename__ = "doors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    location = Column(String, nullable=True)

    access_controls = relationship("AccessControl", back_populates="door")
