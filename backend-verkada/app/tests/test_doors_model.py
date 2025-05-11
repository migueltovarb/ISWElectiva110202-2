from app.models.door import Door
from app.core.database import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_doors.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_door_model_columns():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    door = Door(name="Test Door", location="Main Entrance")
    db.add(door)
    db.commit()
    db.refresh(door)

    assert door.id is not None
    assert door.name == "Test Door"
    assert door.location == "Main Entrance"

    db.close()
    Base.metadata.drop_all(bind=engine)
