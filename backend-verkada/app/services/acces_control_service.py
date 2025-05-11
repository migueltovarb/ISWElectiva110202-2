from sqlalchemy.orm import Session
from app.models.acces_control import AccessControl
from app.schemas.acces_control import AccessControlCreate

def grant_access(db: Session, access_data: AccessControlCreate):
    access = AccessControl(**access_data.dict())
    db.add(access)
    db.commit()
    db.refresh(access)
    return access

def get_access(db: Session, access_id: int):
    return db.query(AccessControl).filter(AccessControl.id == access_id).first()

def revoke_access(db: Session, access_id: int):
    access = get_access(db, access_id)
    if access:
        db.delete(access)
        db.commit()
    return access
