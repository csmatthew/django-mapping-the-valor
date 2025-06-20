from django.urls import path
from .views import about_view, valorrecord_list

urlpatterns = [
    path('about/', about_view, name='about'),
    path('valor-records/', valorrecord_list, name='valorrecord_list'),
]