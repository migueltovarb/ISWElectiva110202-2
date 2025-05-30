from django.db import models

class Door(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=255)
    is_locked = models.BooleanField(default=True)
