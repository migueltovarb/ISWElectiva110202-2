from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user, visitor, acces_control, visit, door

app = FastAPI(
    title="Sistema de Control de Acceso",
    version="1.0.0",
    description="API para gestión de accesos, usuarios y visitantes."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/api/users", tags=["Users"])
app.include_router(visitor.router, prefix="/api/visitors", tags=["Visitors"])
app.include_router(acces_control.router, prefix="/api/access", tags=["Access Control"])
app.include_router(visit.router, prefix="/api/visits", tags=["Visits"])
app.include_router(door.router, prefix="/api/doors", tags=["Doors"])

@app.on_event("startup")
async def startup_event():
    print("API Iniciada Correctamente")

@app.on_event("shutdown")
async def shutdown_event():
    print("API Finalizada Correctamente")
