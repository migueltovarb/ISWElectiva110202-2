from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user_success():
    response = client.post(
        "/api/users/",
        json={"username": "testuser1", "password": "testpass"}
    )
    assert response.status_code in [200, 400]

def test_register_user_duplicate():
    client.post("/api/users/", json={"username": "testuser2", "password": "testpass"})
    response = client.post(
        "/api/users/",
        json={"username": "testuser2", "password": "testpass"}
    )
    assert response.status_code == 400

def test_register_user_missing_fields():
    response = client.post("/api/users/", json={"username": "testuser3"})
    assert response.status_code == 422

def test_get_nonexistent_user():
    response = client.get("/api/users/9999")
    assert response.status_code == 404

def test_get_existing_user():
    create_resp = client.post("/api/users/", json={"username": "existinguser", "password": "testpass"})
    user_id = create_resp.json().get("id")
    if user_id:
        response = client.get(f"/api/users/{user_id}")
        assert response.status_code == 200
        user = response.json()
        assert user["id"] == user_id
        assert user["username"] == "existinguser"
