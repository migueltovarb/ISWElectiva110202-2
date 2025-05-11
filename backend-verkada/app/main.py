from fastapi import FastAPI
from app.routes import user, visitor, access_control

app = FastAPI()

app.include_router(user.router)
app.include_router(visitor.router)
app.include_router(access_control.router)
