from django import forms
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
                    "house_type": (
                        record.house_type.house_type
                        if record.house_type
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

    # Prepare form fields with additional context for foreign keys
    form_fields = []
    for field in form:
        is_fk_field = isinstance(field.field, forms.ModelChoiceField)
        if is_fk_field and field.value():
            # Get the string representation of the related object
            related_object = field.field.queryset.get(pk=field.value())
            display_value = str(related_object)
        else:
            display_value = field.value() or "-"
        form_fields.append((field, is_fk_field, display_value))

    return render(
        request,
        "mapper/modals/crud_modal_content.html",
        {"form_fields": form_fields, "record": record},
    )


@csrf_protect
def update_record(request, slug):
    record = get_object_or_404(ValorRecord, slug=slug)

    if request.method == 'POST':
        form = ValorRecordForm(request.POST, instance=record)

        if form.is_valid():
            updated_record = form.save()

            # Prepare updated record data to return
            record_data = {
                "slug": updated_record.slug,
                "name": updated_record.name,
                "record_type": (
                    updated_record.record_type.record_type
                    if updated_record.record_type else ""
                ),
                "house_type": (
                    updated_record.house_type.house_type
                    if (
                        hasattr(updated_record, "house_type")
                        and updated_record.house_type
                    )
                    else ""
                ),
                "deanery": (
                    updated_record.deanery.deanery_name
                    if updated_record.deanery else ""
                ),
                "religious_order": (
                    updated_record.religious_order.religious_order
                    if updated_record.religious_order
                    else ""
                ),
                "valuation": (
                    updated_record.valuation.get_formatted_value()
                    if (
                        hasattr(updated_record, "valuation")
                        and updated_record.valuation
                    )
                    else ""
                ),
            }

            return JsonResponse({
                "success": True,
                "message": "Record updated successfully!",
                "record": record_data
            })
        else:
            return JsonResponse(
                {"success": False, "errors": form.errors},
                status=400
            )
