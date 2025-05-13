from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from valor_records.models import (
    RecordType, Deanery, ReligiousOrder, HouseType
)


class ValorRecord(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    # General
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    record_type = models.ForeignKey(
        RecordType,
        on_delete=models.CASCADE,
        related_name='valor_records'
    )
    dedication = models.CharField(blank=True, max_length=255, null=True)
    deanery = models.ForeignKey(
        Deanery,
        on_delete=models.CASCADE,
        related_name='valor_records'
    )
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending'
    )

    # Monastic
    house_type = models.ForeignKey(
        HouseType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='valor_records'
    )
    religious_order = models.ForeignKey(
        ReligiousOrder, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='religious_order_records'
    )

    # Geographical Coordinates
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )

    # Reference data
    source_ref_vol = models.IntegerField(null=True, blank=True)
    source_ref_page = models.IntegerField(null=True, blank=True)

    # User data
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='created_valor_records'
    )
    last_edited_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='edited_valor_records'
    )
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    # Check for duplicates and append an incremental number if necessary
    def generate_unique_slug(self):
        # Determine the base slug based on the record type and house type
        record_type_value = (
            self.record_type.record_type if self.record_type else 'None'
        )
        house_type_value = (
            self.house_type.house_type if self.house_type else 'None'
        )

        if record_type_value == 'Monastery' and self.house_type:
            base_slug = slugify(f"{self.name}-{house_type_value}")
        else:
            base_slug = slugify(f"{self.name}-{record_type_value}")

        slug = base_slug
        ModelClass = self.__class__
        counter = 1

        # Fetch existing slugs that start with the same base
        existing_slugs = list(
            ModelClass.objects.filter(
                slug__startswith=base_slug
            ).values_list('slug', flat=True)
        )

        # Debugging output
        print(f"Base Slug: {base_slug}")
        print(f"Existing Slugs: {existing_slugs}")

        # Append an incremental number if a duplicate slug exists
        while slug in existing_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1

        print(f"Final Generated Slug: {slug}")
        return slug

    def save(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        if not self.pk and user:
            self.created_by = user
        if user:
            self.last_edited_by = user

        # Ensure slug uniqueness only when first creating an object
        if not self.slug:
            self.slug = self.generate_unique_slug()

        # Regenerate the slug only if the name, record_type,
        # or house_type has changed
        if self.pk:
            original = self.__class__.objects.get(pk=self.pk)
            if (
                original.name != self.name or
                original.record_type != self.record_type or
                original.house_type != self.house_type
            ):
                self.slug = self.generate_unique_slug()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_raw_value(self):
        """Retrieve the valuation associated with this record."""
        return self.valuation.get_raw_value()
