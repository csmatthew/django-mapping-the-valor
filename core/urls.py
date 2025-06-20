from django.urls import path
from .views import about_view, valorrecord_list, valorrecord_detail

urlpatterns = [
    path('about/', about_view, name='about'),
    path('valor-records/', valorrecord_list, name='valorrecord_list'),
    path('valor-records/<slug:slug>/', valorrecord_detail, name='valorrecord_detail'),
]