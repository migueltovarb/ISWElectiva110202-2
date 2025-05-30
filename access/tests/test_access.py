import pytest
from rest_framework.test import APIClient
from users.models import User
from doors.models import Door
from access.models import AccessPermission
from django.utils import timezone
from datetime import timedelta

@pytest.mark.django_db
def test_create_permanent_access():
    user = User.objects.create_user(username='resident1', password='pass', role='resident')
    door = Door.objects.create(name='PuertaAcceso1', location='Zona A', is_locked=True)
    client = APIClient()
    client.force_authenticate(user=user)
    data = {
        "user": user.id,
        "door": door.id,
        "is_permanent": True,
        "expires_at": None
    }
    response = client.post("/api/access/", data)
    assert response.status_code == 201
    assert AccessPermission.objects.filter(user=user, door=door, is_permanent=True).exists()

@pytest.mark.django_db
def test_list_access_permissions():
    user = User.objects.create_user(username='adminperm', password='pass', role='admin')
    door = Door.objects.create(name='PuertaAcceso3', location='Zona C', is_locked=False)
    perm = AccessPermission.objects.create(user=user, door=door, is_permanent=True)
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get("/api/access/")
    assert response.status_code == 200
    assert any(item["id"] == perm.id for item in response.data)
