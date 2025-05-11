from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AccessControlBase(BaseModel):
    user_id: Optional[int] = None
    visitor_id: Optional[int] = None
    door_id: int

class AccessControlCreate(AccessControlBase):
    pass

class AccessControlResponse(AccessControlBase):
    id: int
    access_granted_at: datetime

    class Config:
        orm_mode = True
