from django.urls import path
from . import views
from .views import (
    crud_modal_view,
    crud_read_view,
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
        "modal/",
        crud_modal_view,
        name="crud_modal"
    ),
    # URL for loading a specific ValorRecord into the modal
    path(
        "modal/<slug:slug>/read/",
        crud_read_view,
        name="crud_read_modal"
    ),
]
