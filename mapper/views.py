from django.shortcuts import render
from django.http import JsonResponse
from valor_records.models import ValorRecord


def map_view(request):
    return render(request, 'mapper/map.html')


def valor_records_json(request):
    valor_records = ValorRecord.objects.filter(status='approved')
    data = [
        {
            'name': record.name,
            'record_type': record.record_type,
            'house_type': (record.house_type.house_type
                           if record.house_type else None),
            'deanery': record.deanery.deanery_name if record.deanery else None,
            'latitude': record.latitude,
            'longitude': record.longitude,
            'slug': record.slug,
            'religious_order': (
                record.religious_order.get_religious_order_display()
                if record.religious_order else None
            ),
        }
        for record in valor_records
    ]
    return JsonResponse(data, safe=False)
