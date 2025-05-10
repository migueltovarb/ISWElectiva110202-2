import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.services.user_service import create_user, get_user
from app.schemas.user import UserCreate

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_create_user(db):
    user_data = UserCreate(username="testuser", password="testpassword")
    user = create_user(db, user_data)
    assert user.username == "testuser"
    assert user.password == "testpasswordnotreallyhashed"

def test_get_user(db):
    user = get_user(db, username="testuser")
    assert user is not None
    assert user.username == "testuser"
