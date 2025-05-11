from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.visitor import VisitorCreate, VisitorResponse
from app.services import visitor_service
from app.core.database import get_db

router = APIRouter(prefix="/visitors", tags=["Visitors"])

@router.post("/", response_model=VisitorResponse)
def create_visitor(visitor: VisitorCreate, db: Session = Depends(get_db)):
    new_visitor = visitor_service.create_visitor(db, visitor)
    if not new_visitor:
        raise HTTPException(status_code=400, detail="Visitor already registered")
    return new_visitor

@router.get("/{visitor_id}", response_model=VisitorResponse)
def get_visitor(visitor_id: int, db: Session = Depends(get_db)):
    visitor = visitor_service.get_visitor(db, visitor_id)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return visitor

@router.delete("/{visitor_id}")
def deactivate_visitor(visitor_id: int, db: Session = Depends(get_db)):
    visitor = visitor_service.deactivate_visitor(db, visitor_id)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return {"detail": "Visitor deactivated"}
