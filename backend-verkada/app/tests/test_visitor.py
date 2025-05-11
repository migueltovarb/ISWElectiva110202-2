from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_visitor():
    data = {
        "name": "John Doe",
        "document_id": "ABC123",
        "visit_reason": "Meeting"
    }
    response = client.post("/api/visitors/", json=data)
    assert response.status_code == 200
    assert response.json()["name"] == "John Doe"
    assert response.json()["document_id"] == "ABC123"
    assert response.json()["is_active"] is True

def test_get_visitor():
    response = client.get("/visitors/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_deactivate_visitor():
    response = client.delete("/visitors/1")
    assert response.status_code == 200
    assert response.json()["detail"] == "Visitor deactivated"
