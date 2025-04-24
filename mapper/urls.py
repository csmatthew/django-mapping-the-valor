from django.urls import path
from . import views

urlpatterns = [
    path('', views.map_view, name='map_view'),
    path(
        'valor-records/',
        views.valor_records_json,
        name='valor_records_json'
    ),
]
