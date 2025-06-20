from django.core.paginator import Paginator
from django.shortcuts import render
from valor_records.models import ValorRecord


def about_view(request):
    return render(request, "core/about.html")


def valorrecord_list(request):
    records = ValorRecord.objects.all().order_by('name')
    paginator = Paginator(records, 10)  # Show 10 records per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(
        request,
        'core/valorrecord_list.html',
        {'page_obj': page_obj}
    )
