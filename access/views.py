from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from access.models import AccessPermission
from access.serializers import AccessPermissionSerializer
from users.models import User
from doors.models import Door
from alarms.models import Alarm


@api_view(['POST'])
def attempt_access(request):
    user_id = request.data.get('user_id')
    door_id = request.data.get('door_id')

    if not user_id or not door_id:
        return Response({'error': 'Faltan parámetros'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
        door = Door.objects.get(id=door_id)
    except (User.DoesNotExist, Door.DoesNotExist):
        return Response({'error': 'Usuario o puerta no existe'}, status=status.HTTP_404_NOT_FOUND)

    permissions = AccessPermission.objects.filter(user=user, door=door)

    for perm in permissions:
        if perm.is_active():
            return Response({'message': 'Acceso permitido'}, status=status.HTTP_200_OK)

    Alarm.objects.create(
        user=user,
        door=door,
        reason="Intento de acceso no autorizado"
    )

    return Response({'message': 'Acceso denegado, alarma activada'}, status=status.HTTP_403_FORBIDDEN)

class AccessPermissionViewSet(viewsets.ModelViewSet):
    queryset = AccessPermission.objects.all()
    serializer_class = AccessPermissionSerializer
