from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Door
from .serializers import DoorSerializer

class DoorViewSet(viewsets.ModelViewSet):
    queryset = Door.objects.all()
    serializer_class = DoorSerializer

    @action(detail=True, methods=['patch'], url_path='lock')
    def lock(self, request, pk=None):
        door = self.get_object()
        door.is_locked = True
        door.save()
        return Response({'status': 'locked'})

    @action(detail=True, methods=['patch'], url_path='unlock')
    def unlock(self, request, pk=None):
        door = self.get_object()
        door.is_locked = False
        door.save()
        return Response({'status': 'unlocked'})
