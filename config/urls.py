from django.contrib import admin
from django.urls import path, include
from core.views import index

urlpatterns = [
    path('', index, name='index'),
    path('accounts/', include('allauth.urls')),
    path('admin/', admin.site.urls),
]
