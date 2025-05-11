from fastapi import FastAPI
from app.routes import user, visitor, acces_control, visit

app = FastAPI()

app.include_router(user.router)
app.include_router(visitor.router)
app.include_router(acces_control.router)
app.include_router(visit.router)
