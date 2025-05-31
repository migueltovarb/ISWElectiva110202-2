from rest_framework import serializers
from .models import AccessPermission

class AccessPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessPermission
        fields = '__all__'
class LectorSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'user', 'door', 'created_at']
