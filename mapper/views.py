from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from valor_records.models import (
    ValorRecord, Deanery, HouseType, RecordType, ReligiousOrder
)
from valor_records.forms import ValorRecordForm


def map_view(request):
    deaneries = Deanery.objects.all().order_by('deanery_name')
    house_types = HouseType.objects.all()
    record_types = RecordType.objects.all().order_by('record_type')
    religious_orders = ReligiousOrder.objects.all()

    return render(request, 'mapper/map.html', {
        'deaneries': deaneries,
        'house_types': house_types,
        'record_types': record_types,
        'religious_orders': religious_orders,
        })


@csrf_protect
def valor_records_json(request):
    slug = request.GET.get("slug")  # Get the slug from the query parameters
    if request.method == "GET":
        if slug:
            # Fetch a single record by slug
            record = get_object_or_404(ValorRecord, slug=slug)
            data = {
                "dedication": record.dedication or "Unknown",
                "slug": record.slug,
            }
            return JsonResponse(data)
        else:
            # Fetch all records
            records = ValorRecord.objects.all()
            data = [
                {
                    "name": record.name,
                    "record_type": (
                        record.record_type.record_type
                        if record.record_type
                        else None
                    ),
                    "deanery": (
                        record.deanery.deanery_name if record.deanery else None
                    ),
                    "latitude": record.latitude,
                    "longitude": record.longitude,
                    "slug": record.slug,
                    "religious_order": (
                        record.religious_order.religious_order
                        if record.religious_order
                        else None
                    ),
                    "valuation": (
                        record.valuation.get_formatted_value()
                        if hasattr(record, "valuation") and record.valuation
                        else None
                    ),
                }
                for record in records
            ]
            return JsonResponse(data, safe=False)


def crud_modal(request, slug):
    record = get_object_or_404(ValorRecord, slug=slug)
    form = ValorRecordForm(instance=record)
    return render(
        request,
        "mapper/modals/crud_modal_content.html",
        {"form": form, "record": record},
    )


@csrf_protect
def update_record(request, slug):
    record = get_object_or_404(ValorRecord, slug=slug)

    if request.method == 'POST':
        form = ValorRecordForm(request.POST, instance=record)

        if form.is_valid():
            form.save()
            return JsonResponse({
                "success": True,
                "message": "Record updated successfully!"
            })
        else:
            return JsonResponse(
                {"success": False, "errors": form.errors},
                status=400
            )
