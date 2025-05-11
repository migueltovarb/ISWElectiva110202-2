from pydantic import BaseModel

class DoorBase(BaseModel):
    name: str
    location: str | None = None

class DoorCreate(DoorBase):
    pass

class DoorResponse(DoorBase):
    id: int

    class Config:
        orm_mode = True
