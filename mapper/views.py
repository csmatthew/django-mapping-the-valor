from django.shortcuts import render
from django.http import JsonResponse
from valor_records.models import ValorRecord
from valor_records.models.hierarchy import Deanery


def map_view(request):
    deaneries = Deanery.objects.all().order_by('deanery_name')
    return render(request, 'mapper/map.html', {'deaneries': deaneries})


def valor_records_json(request):
    valor_records = ValorRecord.objects.filter(status='approved')
    data = [
        {
            'name': str(record.name) if record.name else None,
            'record_type': record.record_type,
            'house_type': (
                str(record.house_type) if record.house_type else None
            ),
            'deanery': record.deanery.deanery_name if record.deanery else None,
            'latitude': record.latitude,
            'longitude': record.longitude,
            'slug': record.slug,
            'religious_order': (
                record.religious_order.get_religious_order_display()
                if record.religious_order else None
            ),
            'valuation': (
                record.get_raw_value()
                if hasattr(record, 'get_raw_value')
                # ref. valuation.py
                else None
            ),
            'decimal_valuation': (
                record.valuation.convert_to_decimal()
                if record.valuation else None
            ),
        }
        for record in valor_records
    ]
    return JsonResponse(data, safe=False)
