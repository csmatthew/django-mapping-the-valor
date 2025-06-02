from django.urls import path
from . import views


urlpatterns = [
    path('', views.map_view, name='map'),
    path(
        'modal/create/',
        views.crud_modal_create,
        name='crud_modal_create'
    ),
    path('modal/<slug:slug>/', views.crud_modal, name='crud_modal'),
    path('add-record/', views.add_record, name='add_record'),
    path(
        'modal/<slug:slug>/update/',
        views.update_record,
        name='update_record'
    ),
    path(
        'valor-records/',
        views.valor_records_json,
        name='valor_records_json'
    ),
    path(
        'modal/<slug:slug>/delete/',
        views.delete_record,
        name='delete_record'
    ),
]
