import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.door import DoorCreate

client = TestClient(app)

def test_create_door():
    door_data = {"name": "Main Entrance", "location": "Lobby"}
    response = client.post("/api/doors/", json=door_data)
    assert response.status_code == 200
    result = response.json()
    assert result["name"] == "Main Entrance"
    assert result["location"] == "Lobby"
    assert "id" in result
def test_get_door():
    door_data = {"name": "Server Room", "location": "2nd Floor"}
    create_resp = client.post("/api/doors/", json=door_data)
    door_id = create_resp.json()["id"]

    response = client.get(f"/api/doors/{door_id}")
    assert response.status_code == 200
    result = response.json()
    assert result["name"] == "Server Room"
    assert result["location"] == "2nd Floor"
