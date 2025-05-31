from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('doors.urls')),
    path('api/', include('alarms.urls')),
     path('api/access/', include('access.urls')),
    path('api/', include('visits.urls')),
]
