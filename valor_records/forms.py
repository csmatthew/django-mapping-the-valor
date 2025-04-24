from django import forms
from .models import ValorRecord, HouseType, ReligiousOrder


class ValorRecordForm(forms.ModelForm):
    house_type = forms.ModelChoiceField(
        queryset=HouseType.objects.all(),
        required=False,
        label='House Type'
    )
    religious_order = forms.ModelChoiceField(
        queryset=ReligiousOrder.objects.all(),
        required=False,
        label='Religious Order'
    )

    class Meta:
        model = ValorRecord
        fields = [
            'name', 'record_type', 'deanery', 'status', 'house_type',
            'religious_order', 'latitude', 'longitude', 'source_ref_vol',
            'source_ref_page'
        ]

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if self.instance.pk and self.instance.house_type:
            self.fields['house_type'].initial = self.instance.house_type
        if self.instance.pk and self.instance.religious_order:
            self.fields['religious_order'].initial = \
                self.instance.religious_order

        if user and not user.is_superuser:
            self.fields['status'].disabled = True

    def set_field(self, instance, field_name, value, condition=True):
        setattr(instance, field_name, value if condition else None)

    def save(self, commit=True):
        instance = super().save(commit=False)
        house_type = self.cleaned_data.get('house_type')
        religious_order = self.cleaned_data.get('religious_order')

        self.set_field(
            instance, 'house_type', house_type,
            instance.record_type == 'Monastery'
        )
        self.set_field(
            instance, 'religious_order', religious_order,
            instance.record_type == 'Monastery'
        )

        if commit:
            instance.save()

        return instance
