from django.contrib import admin
from valor_records.models.hierarchy import Diocese, Archdeaconry, Deanery
from valor_records.models.valor_record import ValorRecord
from valor_records.models.valuation import Valuation


@admin.register(Diocese)
class DioceseAdmin(admin.ModelAdmin):
    list_display = ('diocese_name',)
    search_fields = ('diocese_name',)
    ordering = ('diocese_name',)


@admin.register(Archdeaconry)
class ArchdeaconryAdmin(admin.ModelAdmin):
    list_display = ('archdeaconry_name', 'diocese')
    search_fields = ('archdeaconry_name',)
    list_filter = ('diocese',)
    ordering = ('archdeaconry_name',)


@admin.register(Deanery)
class DeaneryAdmin(admin.ModelAdmin):
    list_display = ('deanery_name', 'archdeaconry')
    search_fields = ('deanery_name',)
    list_filter = ('archdeaconry__diocese', 'archdeaconry')
    ordering = ('deanery_name',)


class ValuationInline(admin.StackedInline):
    model = Valuation
    extra = 0  # No extra empty forms
    fields = ('pounds', 'shillings', 'pence')


@admin.register(ValorRecord)
class ValorRecordAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'record_type', 'deanery', 'status',
        'date_created', 'date_updated'
    )
    search_fields = ('name', 'record_type', 'dedication')
    list_filter = ('record_type', 'status', 'deanery')
    ordering = ('date_created',)
    inlines = [ValuationInline]  # Attach ValuationInline to ValorRecord
