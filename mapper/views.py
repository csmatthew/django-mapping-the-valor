from django.shortcuts import render
from django.http import JsonResponse
from valor_records.models import ValorRecord, HouseType, ReligiousOrder
from valor_records.models.hierarchy import Deanery


def map_view(request):
    deaneries = Deanery.objects.all().order_by('deanery_name')
    house_types = HouseType.objects.all()
    religious_orders = ReligiousOrder.objects.all()

    return render(request, 'mapper/map.html', {
        'deaneries': deaneries,
        'house_types': house_types,
        'religious_orders': religious_orders,
        })


def valor_records_json(request):
    valor_records = ValorRecord.objects.filter(status='approved')
    data = [
        {
            'name': record.name or None,
            'record_type': (
                record.record_type.record_type if record.record_type else None
            ),
            'house_type': (
                record.house_type.house_type if record.house_type else None
            ),
            'deanery': record.deanery.deanery_name if record.deanery else None,
            'latitude': record.latitude,
            'longitude': record.longitude,
            'slug': record.slug,
            'religious_order': (
                record.religious_order.religious_order
                if record.religious_order else None
            ),
            'valuation': (
                record.valuation.get_raw_value()
                if hasattr(record, 'valuation') and record.valuation
                else None
            ),
            'decimal_valuation': (
                record.valuation.convert_to_decimal()
                if hasattr(record, 'valuation') and record.valuation
                else None
            ),
        }
        for record in valor_records
    ]
    return JsonResponse(data, safe=False)
