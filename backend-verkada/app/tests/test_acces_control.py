from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_grant_access():
    data = {
        "visitor_id": 1,
        "door_id": 1
    }
    response = client.post("/access-control/", json=data)
    assert response.status_code == 200
    assert response.json()["visitor_id"] == 1
    assert response.json()["door_id"] == 1

def test_get_access():
    response = client.get("/access-control/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_revoke_access():
    response = client.delete("/access-control/1")
    assert response.status_code == 200
    assert response.json()["detail"] == "Access revoked"
