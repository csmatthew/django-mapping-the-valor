from django import forms
from .models import ValorRecord


class ValorRecordForm(forms.ModelForm):
    class Meta:
        model = ValorRecord
        fields = [
            "name",
            "deanery",
            "record_type",
            "dedication",
            # Monastic
            "house_type",
            "religious_order",
            # Geographical Coordinates
            "latitude",
            "longitude",
            # Reference data
            "source_ref_vol",
            "source_ref_page",

        ]
