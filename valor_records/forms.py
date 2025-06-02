from django import forms
from .models import ValorRecord, Valuation


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
        widgets = {
            "latitude": forms.HiddenInput(),
            "longitude": forms.HiddenInput(),
            "record_type": forms.Select(attrs={"class": "form-control"}),
            "deanery": forms.Select(attrs={"class": "form-control"}),
            "house_type": forms.Select(attrs={"class": "form-control"}),
            "religious_order": forms.Select(attrs={"class": "form-control"}),
        }


class ValuationForm(forms.ModelForm):
    class Meta:
        model = Valuation
        fields = [
            "raw_pounds",
            "raw_shillings",
            "raw_pence",
        ]
