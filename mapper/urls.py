from django.urls import path
from . import views
from .views import (
    crud_modal,
)

urlpatterns = [
    path('', views.map_view, name='map_view'),
    path(
        'valor-records/',
        views.valor_records_json,
        name='valor_records_json'
    ),
    # URL for the generic CRUD modal (without specific record details)
    path(
        "modal/<slug:slug>/",
        crud_modal,
        name="crud_modal"
    ),
]
