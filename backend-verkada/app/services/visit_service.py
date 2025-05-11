from sqlalchemy.orm import Session
from app.models.visit import Visit
from app.schemas.visit import VisitCreate

def register_visit(db: Session, visit_data: VisitCreate):
    visit = Visit(**visit_data.dict())
    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit

def get_visit(db: Session, visit_id: int):
    return db.query(Visit).filter(Visit.id == visit_id).first()
