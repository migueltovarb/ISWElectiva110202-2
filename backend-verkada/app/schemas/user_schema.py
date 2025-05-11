from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    is_admin: bool = False

    class Config:
        from_attributes = True
