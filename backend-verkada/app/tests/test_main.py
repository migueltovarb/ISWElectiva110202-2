import asyncio
from app.main import startup_event, shutdown_event

def test_startup_event():
    asyncio.run(startup_event())

def test_shutdown_event():
    asyncio.run(shutdown_event())
