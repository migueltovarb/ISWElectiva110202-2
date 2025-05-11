from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VisitBase(BaseModel):
    visitor_id: int
    door_id: int
    purpose: Optional[str] = None

class VisitCreate(VisitBase):
    visit_time: Optional[datetime] = None

class VisitResponse(VisitBase):
    id: int
    visit_time: datetime

    class Config:
        orm_mode = True
