from django.db import models
from users.models import User
from doors.models import Door
from django.utils import timezone

class Alarm(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    door = models.ForeignKey(Door, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    reason = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
