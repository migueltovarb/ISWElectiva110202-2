from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccessPermissionViewSet, attempt_access

router = DefaultRouter()
router.register(r'', AccessPermissionViewSet)

urlpatterns = [
    path('attempt/', attempt_access),
    path('', include(router.urls)),
]
