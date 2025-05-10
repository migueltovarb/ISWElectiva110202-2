from app.core.database import Base, engine
from fastapi import FastAPI
from app.routes import user

app = FastAPI()

# ¡Crear las tablas automáticamente!
Base.metadata.create_all(bind=engine)

app.include_router(user.router, prefix="/api")
