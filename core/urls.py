from django.urls import path, include
from .views import index, search_view

urlpatterns = [
    path('', index, name='index'),
    path('search/', search_view, name='search'),
    path('valor-record/', include('valor_records.urls')),
]
