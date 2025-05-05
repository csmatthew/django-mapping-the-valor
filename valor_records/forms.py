from django import forms
from .models import ValorRecord


class ValorRecordForm(forms.ModelForm):
    class Meta:
        model = ValorRecord
        fields = [
            "name",
            "deanery",
            "dedication",

        ]
