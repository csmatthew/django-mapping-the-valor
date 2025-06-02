from django.contrib import admin
from django.urls import path, include
from mapper.views import map_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', map_view, name='home'),
    path('mapper/', include('mapper.urls')),
    path('accounts/', include('allauth.urls')),
]
