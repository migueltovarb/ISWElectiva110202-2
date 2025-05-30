import pytest
from rest_framework.test import APIClient
from users.models import User
from doors.models import Door
from alarms.models import Alarm

@pytest.mark.django_db
def test_create_alarm():
    user = User.objects.create_user(username='alarmuser', password='pass', role='visitor')
    door = Door.objects.create(name='PuertaX', location='Zona A', is_locked=True)
    client = APIClient()
    client.force_authenticate(user=user)
    data = {
        "user": user.id,
        "door": door.id,
        "reason": "Intento forzado"
    }
    response = client.post("/api/alarms/", data)
    assert response.status_code == 201
    assert Alarm.objects.filter(user=user, door=door).exists()

@pytest.mark.django_db
def test_list_alarms():
    user = User.objects.create_user(username='alarmreader', password='pass', role='admin')
    door = Door.objects.create(name='PuertaY', location='Zona B', is_locked=False)
    Alarm.objects.create(user=user, door=door, reason="Intento no autorizado")
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get("/api/alarms/")
    assert response.status_code == 200
    assert len(response.data) >= 1

@pytest.mark.django_db
def test_deactivate_alarm():
    user = User.objects.create_user(username='alarmadmin', password='pass', role='admin')
    door = Door.objects.create(name='PuertaZ', location='Zona C', is_locked=False)
    alarm = Alarm.objects.create(user=user, door=door, reason="Falla de sensor", is_active=True)
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.patch(f"/api/alarms/{alarm.id}/", {"is_active": False})
    assert response.status_code == 200
    alarm.refresh_from_db()
    assert alarm.is_active is False
