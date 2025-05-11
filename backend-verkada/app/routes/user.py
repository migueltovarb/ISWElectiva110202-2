from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.services import user_service

router = APIRouter()

@router.post("/", response_model=UserCreate)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    db_user = user_service.get_user_by_username(db, user_data.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return user_service.create_user(db, user_data)

@router.get("/{user_id}", response_model=UserCreate)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
