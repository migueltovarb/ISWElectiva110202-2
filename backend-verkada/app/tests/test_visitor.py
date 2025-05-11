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

def test_register_visit():
    visitor_resp = client.post("/api/visitors/", json={
        "name": "Visit Tester",
        "document_id": "VISIT123",
        "visit_reason": "Testing Visits"
    })
    visitor_id = visitor_resp.json()["id"]

    door_resp = client.post("/api/doors/", json={
        "name": "Test Door",
        "location": "Test Location"
    })
    door_id = door_resp.json()["id"]
    visit_data = {
        "visitor_id": visitor_id,
        "door_id": door_id,
        "reason": "Test Visit"
    }
    response = client.post("/api/visits/", json=visit_data)
    assert response.status_code == 200
    visit = response.json()
    assert visit["visitor_id"] == visitor_id
    assert visit["door_id"] == door_id
    assert visit["reason"] == "Test Visit"
    assert "id" in visit

def test_get_existing_visit():
    visitor_resp = client.post("/api/visitors/", json={
        "name": "Existing Visitor",
        "document_id": "EXIST123",
        "visit_reason": "Test"
    })
    visitor_id = visitor_resp.json()["id"]

    door_resp = client.post("/api/doors/", json={
        "name": "Existing Door",
        "location": "Hall"
    })
    door_id = door_resp.json()["id"]

    visit_resp = client.post("/api/visits/", json={
        "visitor_id": visitor_id,
        "door_id": door_id,
        "reason": "Existing Visit"
    })
    visit_id = visit_resp.json()["id"]

    response = client.get(f"/api/visits/{visit_id}")
    assert response.status_code == 200
    visit = response.json()
    assert visit["id"] == visit_id
    assert visit["reason"] == "Existing Visit"

def test_get_nonexistent_visit():
    response = client.get("/api/visits/9999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Visit not found"}
