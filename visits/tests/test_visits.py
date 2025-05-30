import pytest
from rest_framework.test import APIClient
from users.models import User
from doors.models import Door
from visits.models import Visit
from django.utils import timezone
from datetime import timedelta

@pytest.mark.django_db
def test_create_visit():
    visitor = User.objects.create_user(username='visit1', password='pass', role='visitor')
    door = Door.objects.create(name='PuertaVisit', location='Hall', is_locked=True)
    client = APIClient()
    client.force_authenticate(user=visitor)
    data = {
        "visitor": visitor.id,
        "door": door.id,
        "start_time": timezone.now().isoformat(),
        "end_time": (timezone.now() + timedelta(hours=1)).isoformat(),
        "reason": "Mantenimiento"
    }
    response = client.post("/api/visits/", data)
    assert response.status_code == 201
    assert Visit.objects.filter(visitor=visitor, door=door, reason="Mantenimiento").exists()

@pytest.mark.django_db
def test_list_visits():
    visitor = User.objects.create_user(username='visit2', password='pass', role='visitor')
    door = Door.objects.create(name='PuertaList', location='Lobby', is_locked=False)
    visit = Visit.objects.create(
        visitor=visitor,
        door=door,
        start_time=timezone.now(),
        end_time=timezone.now() + timedelta(hours=2),
        reason="Entrega"
    )
    client = APIClient()
    client.force_authenticate(user=visitor)
    response = client.get("/api/visits/")
    assert response.status_code == 200
    assert any(v["id"] == visit.id for v in response.data)

@pytest.mark.django_db
def test_edit_visit_reason():
    visitor = User.objects.create_user(username='visit3', password='pass', role='visitor')
    door = Door.objects.create(name='PuertaEdit', location='Piso 2', is_locked=True)
    visit = Visit.objects.create(
        visitor=visitor,
        door=door,
        start_time=timezone.now(),
        end_time=timezone.now() + timedelta(hours=1),
        reason="Inicial"
    )
    client = APIClient()
    client.force_authenticate(user=visitor)
    response = client.patch(f"/api/visits/{visit.id}/", {"reason": "Actualizado"})
    assert response.status_code == 200
    visit.refresh_from_db()
    assert visit.reason == "Actualizado"
