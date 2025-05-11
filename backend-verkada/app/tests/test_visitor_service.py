import pytest
from app.services.visitor_service import create_visitor, get_visitor, deactivate_visitor
from app.schemas.visitor import VisitorCreate
from app.core.database import Base
from app.models.visitor import Visitor
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_visitor_service.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_create_visitor(db_session):
    visitor_data = VisitorCreate(name="Visitor Test", document_id="DOC001", visit_reason="Test Visit")
    visitor = create_visitor(db_session, visitor_data)
    assert visitor is not None
    assert visitor.name == "Visitor Test"

    duplicate = create_visitor(db_session, visitor_data)
    assert duplicate is None

def test_get_visitor(db_session):
    visitor_data = VisitorCreate(name="Visitor Get", document_id="DOC002", visit_reason="Get Test")
    created_visitor = create_visitor(db_session, visitor_data)
    fetched_visitor = get_visitor(db_session, created_visitor.id)
    assert fetched_visitor is not None
    assert fetched_visitor.name == "Visitor Get"

def test_deactivate_visitor(db_session):
    visitor_data = VisitorCreate(name="Visitor Deactivate", document_id="DOC003", visit_reason="Deactivate Test")
    created_visitor = create_visitor(db_session, visitor_data)
    deactivated = deactivate_visitor(db_session, created_visitor.id)
    assert deactivated.is_active is False

    # Edge case: Visitor not found
    result = deactivate_visitor(db_session, 9999)
    assert result is None
