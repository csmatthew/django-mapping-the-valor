from django.shortcuts import render, get_object_or_404
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, UpdateView, DeleteView
from django.http import JsonResponse
from django.db import transaction
from .models import ValorRecord, Valuation, Deanery
from .forms import ValorRecordForm
import json
import logging


def valor_record_detail(request, slug):
    valor_record = get_object_or_404(ValorRecord, slug=slug, status='approved')
    return render(
        request,
        'valor_records/valor_record_detail.html',
        {'valor_record': valor_record}
    )


def valor_record_modal(request, slug):
    valor_record = get_object_or_404(ValorRecord, slug=slug, status='approved')
    return render(
        request,
        'mapper/modals/view_card_modal_content.html',
        {'valor_record': valor_record}
    )


logger = logging.getLogger(__name__)


def safe_int(val):
    try:
        return int(val)
    except (ValueError, TypeError):
        return 0


def add_valor_record(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid request method."
            },
            status=405
        )

    try:
        data = json.loads(request.body)
        logger.info(f"Received data: {data}")

        # Validate required fields
        required_fields = [
            "name", "record_type", "latitude", "longitude", "deanery"
        ]
        missing_fields = [
            field for field in required_fields if not data.get(field)
        ]
        if missing_fields:
            logger.warning(f"Missing fields: {missing_fields}")
            return JsonResponse(
                {
                    "success": False,
                    "message": (
                        f"Missing required fields: {', '.join(missing_fields)}"
                    )
                },
                status=400
            )

        # Validate and retrieve deanery
        deanery_name = data.get("deanery")
        logger.info(f"Deanery name received: {deanery_name}")
        try:
            deanery = Deanery.objects.get(pk=deanery_name)
        except Deanery.DoesNotExist:
            logger.warning(f"Deanery '{deanery_name}' not found.")
            return JsonResponse(
                {
                    "success": False,
                    "message": f"Deanery '{deanery_name}' not found."
                },
                status=400
            )

        # Safely parse and cast latitude/longitude
        try:
            latitude = float(data.get("latitude"))
            longitude = float(data.get("longitude"))
        except (ValueError, TypeError):
            logger.warning("Invalid latitude or longitude.")
            return JsonResponse(
                {
                    "success": False,
                    "message": "Latitude and Longitude must be valid numbers."
                },
                status=400
            )

        # Parse valuation fields safely
        pounds = safe_int(data.get("pounds"))
        shillings = safe_int(data.get("shillings"))
        pence = safe_int(data.get("pence"))

        # Use a transaction to ensure atomicity
        with transaction.atomic():
            # Create ValorRecord entry
            valor_record = ValorRecord.objects.create(
                name=data.get("name"),
                record_type=data.get("record_type"),
                latitude=latitude,
                longitude=longitude,
                dedication=data.get("dedication"),
                deanery=deanery,
            )
            logger.info(f"Created ValorRecord: {valor_record}")

            # Create Valuation entry
            Valuation.objects.create(
                valor_record=valor_record,
                pounds=pounds,
                shillings=shillings,
                pence=pence,
            )
            logger.info("Created Valuation entry")

        return JsonResponse(
            {
                "success": True,
                "message": "Record added successfully!",
                "record_id": valor_record.id,
            },
            status=201
        )

    except json.JSONDecodeError:
        logger.error("Invalid JSON format.")
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON format."
            },
            status=400
        )

    except Exception as e:
        logger.error(f"Error adding record: {e}", exc_info=True)
        return JsonResponse(
            {
                "success": False,
                "message": "An unexpected error occurred."
            },
            status=500
        )


class ValorRecordCreateView(LoginRequiredMixin, CreateView):
    model = ValorRecord
    form_class = ValorRecordForm
    template_name = 'valor_records/valor_record_form.html'
    success_url = reverse_lazy('map_view')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)


class ValorRecordUpdateView(LoginRequiredMixin, UpdateView):
    model = ValorRecord
    form_class = ValorRecordForm
    template_name = 'valor_records/valor_record_form.html'
    success_url = reverse_lazy('map_view')

    def form_valid(self, form):
        form.instance.last_edited_by = self.request.user
        return super().form_valid(form)


class ValorRecordDeleteView(LoginRequiredMixin, DeleteView):
    model = ValorRecord
    template_name = 'valor_records/valor_record_confirm_delete.html'
    success_url = reverse_lazy('map_view')
