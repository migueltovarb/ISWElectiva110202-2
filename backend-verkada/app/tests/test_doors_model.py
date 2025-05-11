from app.models.doors import Door
from app.core.database import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_doors_model.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_doors_model_full_coverage():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    door = Door(name="Test Door Coverage", location="Test Location")
    db.add(door)
    db.commit()
    db.refresh(door)

    assert door.id is not None
    assert door.name == "Test Door Coverage"
    assert door.location == "Test Location"

    db.delete(door)
    db.commit()

    db.close()
    Base.metadata.drop_all(bind=engine)
