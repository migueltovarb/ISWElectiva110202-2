import pytest
from rest_framework.test import APIClient
from users.models import User
from doors.models import Door
from access.models import AccessPermission
from alarms.models import Alarm
from django.utils import timezone
from datetime import timedelta

@pytest.mark.django_db
def test_attempt_access_missing_params():
    client = APIClient()
    response = client.post('/api/access/attempt/', {})
    assert response.status_code == 400
    assert 'Faltan parámetros' in response.data['error']

@pytest.mark.django_db
def test_attempt_access_user_or_door_not_found():
    client = APIClient()
    response = client.post('/api/access/attempt/', {'user_id': 999, 'door_id': 999})
    assert response.status_code == 404
    assert 'no existe' in response.data['error']

@pytest.mark.django_db
def test_attempt_access_granted():
    user = User.objects.create_user(username='valid', password='pass', role='resident')
    door = Door.objects.create(name='PuertaValida', location='Zona B', is_locked=False)
    AccessPermission.objects.create(user=user, door=door, is_permanent=True)
    client = APIClient()
    response = client.post('/api/access/attempt/', {
        'user_id': user.id,
        'door_id': door.id
    })
    assert response.status_code == 200
    assert response.data['message'] == 'Acceso permitido'

@pytest.mark.django_db
def test_attempt_access_denied_creates_alarm():
    user = User.objects.create_user(username='intruso', password='pass', role='visitor')
    door = Door.objects.create(name='PuertaDenegada', location='Zona X', is_locked=True)
    client = APIClient()
    response = client.post('/api/access/attempt/', {
        'user_id': user.id,
        'door_id': door.id
    })
    assert response.status_code == 403
    assert response.data['message'] == 'Acceso denegado, alarma activada'
    assert Alarm.objects.filter(user=user, door=door).exists()
