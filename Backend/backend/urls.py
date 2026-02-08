from django.contrib import admin
from django.urls import path, include
from api.views import HealthCheckView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HealthCheckView.as_view(), name='root-health-check'),
    path('api/', include('api.urls')),
    path('api/', include('social_django.urls', namespace='social')),
]
