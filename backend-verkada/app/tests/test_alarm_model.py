# tests/test_alarm_model.py

import pytest
from app.models.alarm import Alarm

def test_alarm_activation():
    alarm = Alarm(id=1, name="Main Entrance", status="inactive", location="Entrance Hall")
    assert not alarm.is_active()

    alarm.status = "active"
    assert alarm.is_active()

def test_alarm_trigger():
    alarm = Alarm(id=2, name="Server Room", status="active", location="Server Room")
    alarm.trigger()
    assert alarm.status == "triggered"

def test_alarm_reset():
    alarm = Alarm(id=3, name="Warehouse", status="triggered", location="Warehouse")
    alarm.reset()
    assert alarm.status == "inactive"
