from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_door_success():
    response = client.post("/api/doors/", json={"name": "Front Door", "location": "Lobby"})
    assert response.status_code == 200

def test_create_door_duplicate():
    client.post("/api/doors/", json={"name": "Duplicate Door", "location": "Lobby"})
    response = client.post("/api/doors/", json={"name": "Duplicate Door", "location": "Lobby"})
    assert response.status_code == 400

def test_create_door_missing_field():
    response = client.post("/api/doors/", json={"location": "Lobby"})
    assert response.status_code == 422

def test_get_existing_door():
    client.post("/api/doors/", json={"name": "Test Door", "location": "Hallway"})
    response = client.get("/api/doors/1")
    assert response.status_code == 200

def test_get_nonexistent_door():
    response = client.get("/api/doors/9999")
    assert response.status_code == 404
