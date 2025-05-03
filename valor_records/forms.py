from django import forms
from .models import ValorRecord


class ValorRecordForm(forms.ModelForm):
    class Meta:
        model = ValorRecord
        fields = [
            "name",
            "record_type",
            "deanery",
            "dedication",
            "house_type",
            "religious_order",
            "latitude",
            "longitude",
        ]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "record_type": forms.Select(attrs={"class": "form-select"}),
            "deanery": forms.Select(attrs={"class": "form-select"}),
            "house_type": forms.Select(attrs={"class": "form-select"}),
            "religious_order": forms.Select(attrs={"class": "form-select"}),
            "latitude": forms.NumberInput(attrs={"class": "form-control"}),
            "longitude": forms.NumberInput(attrs={"class": "form-control"}),
        }
