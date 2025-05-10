from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    response = client.post(
        "/api/users/",
        json={
            "username": "testuser",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200 or response.status_code == 400  # 400 si el usuario ya existe
    if response.status_code == 200:
        data = response.json()
        assert data["username"] == "testuser"

def test_successful_login():
    response = client.post(
        "/api/login/",
        json={
            "username": "testuser",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_failed_login_wrong_password():
    response = client.post(
        "/api/login/",
        json={
            "username": "testuser",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "Invalid username or password"

def test_failed_login_nonexistent_user():
    response = client.post(
        "/api/login/",
        json={
            "username": "nonexistent",
            "password": "any_password"
        }
    )
    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "Invalid username or password"
