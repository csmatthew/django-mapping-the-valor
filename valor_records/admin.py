from django.contrib import admin, messages
from valor_records.models.hierarchy import Diocese, Archdeaconry, Deanery
from valor_records.models.valor_record import ValorRecord
from valor_records.models.valuation import Valuation
from valor_records.models.religious_order import ReligiousOrder
from valor_records.models.house_type import HouseType


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


@admin.display(description='House Type')
def get_house_type(self, obj):
    return str(obj.house_type) if obj.house_type else None


@admin.display(description='Religious Order')
def get_religious_order(self, obj):
    return str(obj.religious_order) if obj.religious_order else None


@admin.register(ValorRecord)
class ValorRecordAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'record_type', 'deanery', 'status',
        'date_created', 'date_updated',
        'slug',
    )
    search_fields = ('name',)
    list_filter = ('record_type', 'status', 'deanery')
    ordering = ('date_created',)
    inlines = [ValuationInline]
    fieldsets = (
        (None, {
            'fields': (
                'name', 'slug', 'record_type', 'deanery', 'status',
                'dedication', 'house_type', 'religious_order',
                'latitude', 'longitude',
                'source_ref_vol', 'source_ref_page'
            )
        }),
        ('User Information', {
            'fields': ('created_by', 'last_edited_by'),
            'classes': ('collapse',),
        }),
    )

    readonly_fields = ('slug', 'created_by', 'last_edited_by')

    class Media:
        js = ('valor_records/js/admin.js',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        obj.last_edited_by = request.user
        super().save_model(request, obj, form, change)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if 'created_by' in form.base_fields:
            del form.base_fields['created_by']
        if 'last_edited_by' in form.base_fields:
            del form.base_fields['last_edited_by']
        if not request.user.is_superuser:
            form.base_fields['status'].disabled = True
        return form

    def get_house_type(self, obj):
        return str(obj.house_type) if obj.house_type else None
    get_house_type.short_description = 'House Type'

    def get_religious_order(self, obj):
        return str(obj.religious_order) if obj.religious_order else None
    get_religious_order.short_description = 'Religious Order'

    def approve_records(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(
            request,
            f"{updated} record(s) successfully approved.",
            messages.SUCCESS
        )
    approve_records.short_description = "Approve selected records"


@admin.register(HouseType)
class HouseTypeAdmin(admin.ModelAdmin):
    list_display = ('house_type',)


@admin.register(ReligiousOrder)
class ReligiousOrderAdmin(admin.ModelAdmin):
    list_display = ('religious_order',)
