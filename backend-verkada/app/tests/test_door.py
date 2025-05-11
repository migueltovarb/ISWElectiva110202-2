from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_and_get_door():
    door_data = {"name": "Test Door Coverage", "location": "Main Hall"}
    response = client.post("/api/doors/", json=door_data)
    assert response.status_code == 200
    door = response.json()
    assert door["name"] == "Test Door Coverage"
    assert door["location"] == "Main Hall"
    assert "id" in door

    door_id = door["id"]
    get_response = client.get(f"/api/doors/{door_id}")
    assert get_response.status_code == 200
    result = get_response.json()
    assert result["name"] == "Test Door Coverage"
    assert result["location"] == "Main Hall"
    assert result["id"] == door_id

def test_get_nonexistent_door():
    response = client.get("/api/doors/9999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Door not found"}