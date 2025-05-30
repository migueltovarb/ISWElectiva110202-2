from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('resident', 'Residente'),
        ('security', 'Personal de Seguridad'),
        ('visitor', 'Visitante'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='visitor')
    is_active = models.BooleanField(default=True)
