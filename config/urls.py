from django.contrib import admin
from django.urls import path, include
from mapper.views import map_view
from core.views import valor_record_detail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', map_view, name='home'),
    path('core/', include('core.urls')),
    path('mapper/', include('mapper.urls')),
    path('accounts/', include('allauth.urls')),
    path(
        'detail/<slug:slug>/',
        valor_record_detail,
        name='valor_record_detail',
    ),
]
