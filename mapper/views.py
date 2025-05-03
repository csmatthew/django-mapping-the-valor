from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from valor_records.models import (
    ValorRecord, Deanery, HouseType, RecordType, ReligiousOrder
)
import requests


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

    elif request.method == "POST":
        if not request.POST.get("csrfmiddlewaretoken"):  # ✅ Checks for CSRF token
            return JsonResponse({"success": False, "error": "CSRF token missing"}, status=403)

        slug = request.POST.get("slug")
        if not slug:
            return JsonResponse({"success": False, "error": "Missing slug"}, status=400)

        record = get_object_or_404(ValorRecord, slug=slug)
        dedication = request.POST.get("dedication", "").strip()

        if dedication:
            record.dedication = dedication
            record.save()
            return JsonResponse({"success": True, "message": "Dedication updated!"})
        else:
            return JsonResponse({"success": False, "error": "Dedication cannot be empty"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

    # Uncomment and implement the DELETE method if needed
    # elif request.method == "DELETE":
    #     # Handle record deletion via slug
    #     slug = request.GET.get("slug")
    #     record = get_object_or_404(ValorRecord, slug=slug)
    #     record.delete()
    #     return JsonResponse({"success": True})

    # Uncomment the following line if DELETE method is implemented
    # return JsonResponse({"error": "Invalid request"}, status=400)


def crud_modal_view(request):
    return render(request, 'mapper/modals/crud_modal.html')


def crud_read_view(request, slug):
    # Fetch record data from valor_records_json
    response = requests.get("/mapper/valor-records/?slug={slug}")

    if response.status_code == 200:
        record_data = response.json()
    else:
        record_data = {}

    return render(request, "mapper/modals/crud_read_modal.html", {"record": record_data})
