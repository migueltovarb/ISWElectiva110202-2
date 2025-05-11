from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.acces_control import AccessControlCreate, AccessControlResponse
from app.services import access_control_service
from app.core.database import get_db

router = APIRouter(prefix="/access-control", tags=["Access Control"])

@router.post("/", response_model=AccessControlResponse)
def grant_access(access: AccessControlCreate, db: Session = Depends(get_db)):
    new_access = access_control_service.grant_access(db, access)
    return new_access

@router.get("/{access_id}", response_model=AccessControlResponse)
def get_access(access_id: int, db: Session = Depends(get_db)):
    access = access_control_service.get_access(db, access_id)
    if not access:
        raise HTTPException(status_code=404, detail="Access control entry not found")
    return access

@router.delete("/{access_id}")
def revoke_access(access_id: int, db: Session = Depends(get_db)):
    access = access_control_service.revoke_access(db, access_id)
    if not access:
        raise HTTPException(status_code=404, detail="Access control entry not found")
    return {"detail": "Access revoked"}
