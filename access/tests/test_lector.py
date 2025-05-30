import pytest
from rest_framework.test import APIClient
from users.models import User
from doors.models import Door
from access.models import Lector, AccessPermission

@pytest.mark.django_db
def test_create_lector_creates_permission():
    user = User.objects.create_user(username='lector_user', password='1234', role='resident')
    door = Door.objects.create(name='Puerta Lector', location='Z', is_locked=False)

    client = APIClient()
    data = {'user': user.id, 'door': door.id}
    response = client.post('/api/access/lector/', data)

    assert response.status_code == 201
    assert AccessPermission.objects.filter(user=user, door=door).exists()
