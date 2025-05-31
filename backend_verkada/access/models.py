from django.db import models
from users.models import User
from doors.models import Door

class AccessPermission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    door = models.ForeignKey(Door, on_delete=models.CASCADE)
    is_permanent = models.BooleanField(default=False)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def is_active(self):
        from django.utils import timezone
        now = timezone.now()
        if self.is_permanent:
            return True
        return self.start_time <= now <= self.end_time
