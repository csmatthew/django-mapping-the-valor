from django.urls import path, include
from .views import index, search_view, valor_record_detail

urlpatterns = [
    path('', index, name='index'),
    path('search/', search_view, name='search'),
    path('valor-records/', include('valor_records.urls')),
    path(
        'detail/<slug:slug>',
        valor_record_detail,
        name='valor_record_detail',
    ),
]
