from django.urls import path
from .views import (
    valor_record_detail,
    valor_record_modal,
    ValorRecordCreateView,
    ValorRecordUpdateView,
    ValorRecordDeleteView,
    add_valor_record,
)

urlpatterns = [
    # Ensure 'add/' is listed before any dynamic slug-based routes
    path(
        'add/', add_valor_record,
        name='add_valor_record'
    ),
    path(
        'create/',
        ValorRecordCreateView.as_view(),
        name='valor_record_create'
    ),

    # Dynamic detail pages, should come last to prevent incorrect matches
    path(
        '<slug:slug>/',
        valor_record_detail,
        name='valor_record_detail'
    ),
    path(
        '<slug:slug>/modal/',
        valor_record_modal,
        name='valor_record_modal'
    ),
    path(
        '<slug:slug>/update/',
        ValorRecordUpdateView.as_view(),
        name='valor_record_update'
    ),
    path(
        '<slug:slug>/delete/',
        ValorRecordDeleteView.as_view(),
        name='valor_record_delete'
    ),
]
