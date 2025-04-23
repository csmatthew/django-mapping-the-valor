from django.db import models
from valor_records.models.valor_record import ValorRecord


class Valuation(models.Model):
    valor_record = models.ForeignKey(
        ValorRecord,
        on_delete=models.CASCADE,
        related_name='valuations'
    )
    pounds = models.PositiveIntegerField(default=0)
    shillings = models.PositiveIntegerField(default=0)
    pence = models.PositiveIntegerField(default=0)
    source = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )  # E.g., "Tithes"
    date_recorded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"£{self.pounds} {self.shillings}s {self.pence}d"
