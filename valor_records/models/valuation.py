from django.db import models
from valor_records.models.valor_record import ValorRecord


class Valuation(models.Model):
    valor_record = models.OneToOneField(
        ValorRecord,
        on_delete=models.CASCADE,
        related_name="valuation"
    )
    pounds = models.PositiveIntegerField(default=0)
    shillings = models.PositiveIntegerField(default=0)
    pence = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"£{self.pounds}, {self.shillings}s., {self.pence}d."

    def get_raw_value(self):
        """Return the value as entered by the user."""
        return f"£{self.pounds}, {self.shillings}s., {self.pence}d."

    def save(self, *args, **kwargs):
        # Normalize shillings and pence for internal consistency
        self.pounds += self.shillings // 20
        self.shillings = self.shillings % 20
        self.shillings += self.pence // 12
        self.pence = self.pence % 12
        super().save(*args, **kwargs)
