from django import forms
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from valor_records.models import ValorRecord
from valor_records.forms import ValorRecordForm


def map_view(request):
    return render(request, "mapper/map.html")


@csrf_protect
def crud_modal(request, slug):
    record = get_object_or_404(ValorRecord, slug=slug)
    form = ValorRecordForm(instance=record)
    return render(
        request,
        "mapper/modals/crud_modal_content.html",
        {
            "form": form,
            "record": record,
            "is_authenticated": request.user.is_authenticated,
        },
    )


@csrf_protect
def crud_modal_create(request):
    form = ValorRecordForm()
    return render(
        request,
        "mapper/modals/crud_modal_content.html",
        {
            "form": form,
            "record": None,
            "is_authenticated": request.user.is_authenticated,
        },
    )


@csrf_protect
def add_record(request):
    if request.method == "POST":
        form = ValorRecordForm(request.POST)
        if form.is_valid():
            record = form.save()
            return JsonResponse({
                "success": True,
                "record": {
                    "name": record.name,
                    "record_type": record.record_type.record_type if record.record_type else "",
                    "latitude": record.latitude,
                    "longitude": record.longitude,
                    "slug": record.slug,
                }
            })
        return JsonResponse(
            {"success": False, "errors": form.errors},
            status=400
        )
    return JsonResponse(
        {"success": False, "errors": "Invalid request"},
        status=400
    )


@csrf_protect
def update_record(request, slug):
    record = get_object_or_404(ValorRecord, slug=slug)
    if request.method == "POST":
        form = ValorRecordForm(request.POST, instance=record)
        if form.is_valid():
            record = form.save()
            return JsonResponse({
                "success": True,
                "record": {
                    "name": record.name,
                    "record_type": record.record_type.record_type if record.record_type else "",
                    "latitude": record.latitude,
                    "longitude": record.longitude,
                    "slug": record.slug,
                }
            })
        return JsonResponse(
            {"success": False, "errors": form.errors},
            status=400
        )
    return JsonResponse(
        {"success": False, "errors": "Invalid request"},
        status=400
    )


@csrf_protect
@require_POST
def delete_record(request, slug):
    record = get_object_or_404(ValorRecord, slug=slug)
    record.delete()
    return JsonResponse({"success": True})


def valor_records_json(request):
    records = ValorRecord.objects.all()
    data = [
        {
            "slug": r.slug,
            "name": r.name,
            "record_type": r.record_type.record_type if r.record_type else "",
            "deanery": r.deanery.deanery_name if r.deanery else "",
            "latitude": r.latitude,
            "longitude": r.longitude,
            # Add other fields as needed
        }
        for r in records
    ]
    return JsonResponse(data, safe=False)
