import pytest
from rest_framework.test import APIClient
from doors.models import Door
from users.models import User

@pytest.mark.django_db
def test_create_door():
    user = User.objects.create_user(username='admin', password='pass', role='admin')
    client = APIClient()
    client.force_authenticate(user=user)
    data = {
        "name": "Puerta Principal",
        "location": "Edificio A",
        "is_locked": True
    }
    response = client.post("/api/doors/", data)
    assert response.status_code == 201
    assert Door.objects.filter(name="Puerta Principal").exists()

@pytest.mark.django_db
def test_get_door_list():
    user = User.objects.create_user(username='admin2', password='pass', role='admin')
    Door.objects.create(name="Puerta Lateral", location="Pasillo", is_locked=True)
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get("/api/doors/")
    assert response.status_code == 200
    assert len(response.data) >= 1

@pytest.mark.django_db
def test_lock_door():
    user = User.objects.create_user(username='lockuser', password='pass', role='admin')
    door = Door.objects.create(name="Puerta 1", location="Entrada", is_locked=False)
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.patch(f"/api/doors/{door.id}/lock/")
    assert response.status_code == 200
    door.refresh_from_db()
    assert door.is_locked is True

@pytest.mark.django_db
def test_unlock_door():
    user = User.objects.create_user(username='unlockuser', password='pass', role='admin')
    door = Door.objects.create(name="Puerta 2", location="Salida", is_locked=True)
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.patch(f"/api/doors/{door.id}/unlock/")
    assert response.status_code == 200
    door.refresh_from_db()
    assert door.is_locked is False