from sqlalchemy import Column, Integer, String, Boolean, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

user_door = Table(
    'user_door',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('door_id', Integer, ForeignKey('doors.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    is_admin = Column(Boolean, default=False)

    doors = relationship("Door", secondary=user_door, backref="users")