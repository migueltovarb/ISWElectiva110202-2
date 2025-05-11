from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.access_control import AccessControlCreate, AccessControlResponse
from app.models.access_control import AccessControl
from app.core.database import get_db

router = APIRouter(prefix="/access-control", tags=["Access Control"])

@router.post("/", response_model=AccessControlResponse)
def grant_access(access: AccessControlCreate, db: Session = Depends(get_db)):
    new_access = AccessControl(**access.dict())
    db.add(new_access)
    db.commit()
    db.refresh(new_access)
    return new_access

@router.get("/{access_id}", response_model=AccessControlResponse)
def get_access(access_id: int, db: Session = Depends(get_db)):
    access = db.query(AccessControl).filter(AccessControl.id == access_id).first()
    if not access:
        raise HTTPException(status_code=404, detail="Access control entry not found")
    return access

@router.delete("/{access_id}")
def revoke_access(access_id: int, db: Session = Depends(get_db)):
    access = db.query(AccessControl).filter(AccessControl.id == access_id).first()
    if not access:
        raise HTTPException(status_code=404, detail="Access control entry not found")
    db.delete(access)
    db.commit()
    return {"detail": "Access revoked"}
