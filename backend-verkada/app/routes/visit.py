from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.visit import VisitCreate, VisitResponse
from app.services import visit_service
from app.core.database import get_db

router = APIRouter(prefix="/visits", tags=["Visits"])

@router.post("/", response_model=VisitResponse)
def register_visit(visit: VisitCreate, db: Session = Depends(get_db)):
    new_visit = visit_service.register_visit(db, visit)
    return new_visit

@router.get("/{visit_id}", response_model=VisitResponse)
def get_visit(visit_id: int, db: Session = Depends(get_db)):
    visit = visit_service.get_visit(db, visit_id)
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    return visit
