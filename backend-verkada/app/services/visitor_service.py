from sqlalchemy.orm import Session
from app.models.visitor import Visitor
from app.schemas.visitor import VisitorCreate

def create_visitor(db: Session, visitor_data: VisitorCreate):
    existing = db.query(Visitor).filter(Visitor.document_id == visitor_data.document_id).first()
    if existing:
        return None
    visitor = Visitor(**visitor_data.dict())
    db.add(visitor)
    db.commit()
    db.refresh(visitor)
    return visitor

def get_visitor(db: Session, visitor_id: int):
    return db.query(Visitor).filter(Visitor.id == visitor_id).first()

def deactivate_visitor(db: Session, visitor_id: int):
    visitor = get_visitor(db, visitor_id)
    if visitor:
        visitor.is_active = False
        db.commit()
    return visitor
