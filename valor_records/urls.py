from django.urls import path
from .views import (
    valor_record_detail,
    valor_record_modal,
    ValorRecordCreateView,
    ValorRecordUpdateView,
    ValorRecordDeleteView,
)

urlpatterns = [
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
        'create/',
        ValorRecordCreateView.as_view(),
        name='valor_record_create'
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
