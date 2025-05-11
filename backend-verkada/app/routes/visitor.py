from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.visitor import VisitorCreate, VisitorResponse
from app.models.visitor import Visitor
from app.core.database import get_db

router = APIRouter(prefix="/visitors", tags=["Visitors"])

@router.post("/", response_model=VisitorResponse)
def create_visitor(visitor: VisitorCreate, db: Session = Depends(get_db)):
    db_visitor = db.query(Visitor).filter(Visitor.document_id == visitor.document_id).first()
    if db_visitor:
        raise HTTPException(status_code=400, detail="Visitor already registered")
    new_visitor = Visitor(**visitor.dict())
    db.add(new_visitor)
    db.commit()
    db.refresh(new_visitor)
    return new_visitor

@router.get("/{visitor_id}", response_model=VisitorResponse)
def get_visitor(visitor_id: int, db: Session = Depends(get_db)):
    visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return visitor

@router.delete("/{visitor_id}")
def deactivate_visitor(visitor_id: int, db: Session = Depends(get_db)):
    visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    visitor.is_active = False
    db.commit()
    return {"detail": "Visitor deactivated"}
