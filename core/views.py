from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from valor_records.models.valor_record import ValorRecord, ReligiousOrder


def index(request):
    return render(request, 'core/index.html')


def search_view(request):
    query = request.GET.get('search')
    results = []
    if query:
        keywords = query.split()
        q_objects = Q()
        for keyword in keywords:
            q_objects |= (
                Q(name__icontains=keyword) |
                Q(record_type__icontains=keyword) |
                Q(deanery__deanery_name__icontains=keyword) |
                Q(house_type__house_type__icontains=keyword)
            )
            # Handle religious_order separately
            for key, value in (
                ReligiousOrder.RELIGIOUS_ORDER_CHOICES_DICT.items()
            ):
                if keyword.lower() in value.lower():
                    q_objects |= Q(religious_order=key)
        results = ValorRecord.objects.filter(q_objects)
    return render(
        request,
        'core/search_results.html',
        {'query': query, 'results': results}
    )


def valor_record_detail(request, slug):
    valor_record = get_object_or_404(ValorRecord, slug=slug)
    return render(
        request,
        'core/valor_record_detail.html',
        {
            'valor_record': valor_record
        }
    )
