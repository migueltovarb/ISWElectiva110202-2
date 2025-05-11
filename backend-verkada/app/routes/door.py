from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.door import Door
from app.schemas.door import DoorCreate, DoorResponse

router = APIRouter()

@router.post("/", response_model=DoorResponse)
def create_door(door: DoorCreate, db: Session = Depends(get_db)):
    new_door = Door(name=door.name, location=door.location)
    db.add(new_door)
    db.commit()
    db.refresh(new_door)
    return new_door

@router.get("/{door_id}", response_model=DoorResponse)
def get_door(door_id: int, db: Session = Depends(get_db)):
    door = db.query(Door).filter(Door.id == door_id).first()
    if not door:
        raise HTTPException(status_code=404, detail="Door not found")
    return door
