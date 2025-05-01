from django.contrib import admin, messages
from .models import (
    Diocese, Archdeaconry, Deanery,
    ValorRecord, Valuation, ReligiousOrder,
    HouseType, RecordType
)


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
    fields = ('raw_pounds', 'raw_shillings', 'raw_pence')
    # Show value input as displayed in the printed record


@admin.register(ValorRecord)
class ValorRecordAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'record_type', 'valuation', 'deanery', 'status',
        'date_created', 'date_updated',
        'slug',
    )
    # 'valuation' is referencing the normalised amount
    search_fields = ('name',)
    list_filter = ('record_type', 'status', 'deanery', 'house_type',)
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

    def approve_records(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(
            request,
            f"{updated} record(s) successfully approved.",
            messages.SUCCESS
        )
    approve_records.short_description = "Approve selected records"

    def reject_records(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(
            request,
            f"{updated} record(s) successfully rejected.",
            messages.SUCCESS
        )
    reject_records.short_description = "Reject selected records"

    actions = [approve_records, reject_records]


@admin.register(HouseType)
class HouseTypeAdmin(admin.ModelAdmin):
    list_display = ('house_type',)
    search_fields = ('house_type',)


@admin.register(ReligiousOrder)
class ReligiousOrderAdmin(admin.ModelAdmin):
    list_display = ('religious_order',)


@admin.register(RecordType)
class RecordTypeAdmin(admin.ModelAdmin):
    list_display = ('record_type',)


@admin.register(Valuation)
class ValuationAdmin(admin.ModelAdmin):
    list_display = (
        'get_slug',
        'get_formatted_value',
        'get_raw_value',
        'convert_to_decimal',
    )
    fields = ('valor_record', 'raw_pounds', 'raw_shillings', 'raw_pence')

    def get_slug(self, obj):
        return obj.valor_record.slug if obj.valor_record else "No Slug"
    get_slug.short_description = 'Record Slug'

    def get_formatted_value(self, obj):
        return obj.get_formatted_value()
    get_formatted_value.short_description = 'Valuation'

    def get_raw_value(self, obj):
        return obj.get_raw_value()
    get_raw_value.short_description = 'As in Record'

    def convert_to_decimal(self, obj):
        return obj.convert_to_decimal()
    convert_to_decimal.short_description = 'Decimalised'
