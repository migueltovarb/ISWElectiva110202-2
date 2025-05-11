from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Door(Base):
    __tablename__ = "doors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
