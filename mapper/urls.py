from django.urls import path
from . import views
from .views import (
    crud_modal,
    add_record,
    get_dropdown_options,
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
    path(
        'modal/<slug:slug>/update/',
        views.update_record,
        name='update_record'
    ),
    path('add-record/', add_record, name='add_record'),
    path('get-dropdown-options/', get_dropdown_options, name='get_dropdown_options'),
]
