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
    visitor = response.json()
    assert visitor["name"] == "John Doe"
    assert visitor["document_id"] == "ABC123"
    assert visitor["is_active"] is True
    assert "id" in visitor

def test_get_existing_visitor():
    create_resp = client.post("/api/visitors/", json={
        "name": "Jane Smith",
        "document_id": "XYZ789",
        "visit_reason": "Consultation"
    })
    visitor_id = create_resp.json()["id"]

    response = client.get(f"/api/visitors/{visitor_id}")
    assert response.status_code == 200
    visitor = response.json()
    assert visitor["id"] == visitor_id
    assert visitor["name"] == "Jane Smith"

def test_get_nonexistent_visitor():
    response = client.get("/api/visitors/9999")
    assert response.status_code == 404

def test_deactivate_existing_visitor():
    create_resp = client.post("/api/visitors/", json={
        "name": "Mark Johnson",
        "document_id": "LMN456",
        "visit_reason": "Inspection"
    })
    visitor_id = create_resp.json()["id"]

    response = client.delete(f"/api/visitors/{visitor_id}")
    assert response.status_code == 200
    assert response.json()["detail"] == "Visitor deactivated"

def test_deactivate_nonexistent_visitor():
    response = client.delete("/api/visitors/9999")
    assert response.status_code == 404
