import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_grant_access_success():
    client.post("/api/doors/", json={"name": "Main Door", "location": "Lobby"})
    client.post("/api/users/", json={"username": "access_user", "password": "pass"})
    response = client.post(
        "/api/access/",
        json={"user_id": 1, "door_id": 1}
    )
    assert response.status_code == 200

def test_grant_access_missing_fields():
    response = client.post("/api/access/", json={"user_id": 1})
    assert response.status_code == 422

def test_get_access_nonexistent():
    response = client.get("/api/access/9999")
    assert response.status_code == 404

def test_revoke_access_nonexistent():
    response = client.delete("/api/access/9999")
    assert response.status_code == 404
