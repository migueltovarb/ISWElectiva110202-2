import pytest
from rest_framework.test import APIClient
from users.models import User

@pytest.mark.django_db
def test_create_user():
    client = APIClient()
    data = {
        "username": "juanfer",
        "email": "juanfer@example.com",
        "password": "pass1234",
        "first_name": "Juan",
        "last_name": "Rosero",
        "role": "admin"
    }
    response = client.post("/api/users/", data)
    assert response.status_code == 201
    assert User.objects.filter(username="juanfer").exists()

@pytest.mark.django_db
def test_get_users_list():
    user = User.objects.create_user(username="adminuser", password="pass", role="admin")
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get("/api/users/")
    assert response.status_code == 200
    assert len(response.data) >= 1

@pytest.mark.django_db
def test_edit_user():
    user = User.objects.create_user(username="editme", password="pass", role="admin")
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.patch(f"/api/users/{user.id}/", {"first_name": "NewName"})
    assert response.status_code == 200
    user.refresh_from_db()
    assert user.first_name == "NewName"