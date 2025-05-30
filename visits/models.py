from django.db import models
from users.models import User
from doors.models import Door
from django.utils import timezone

class Visit(models.Model):
    visitor = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'visitor'})
    door = models.ForeignKey(Door, on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField()
    reason = models.CharField(max_length=255)
