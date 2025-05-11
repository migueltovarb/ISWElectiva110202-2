from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VisitorBase(BaseModel):
    name: str
    document_id: str
    visit_reason: Optional[str] = None

class VisitorCreate(VisitorBase):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class VisitorResponse(VisitorBase):
    id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    is_active: bool

    class Config:
        orm_mode = True
