from rest_framework import viewsets
from .models import Alarm
from .serializers import AlarmSerializer

class AlarmViewSet(viewsets.ModelViewSet):
    queryset = Alarm.objects.all()
    serializer_class = AlarmSerializer
