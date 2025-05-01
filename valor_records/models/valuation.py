from django.db import models
from valor_records.models.valor_record import ValorRecord


class Valuation(models.Model):
    valor_record = models.OneToOneField(
        ValorRecord,
        on_delete=models.CASCADE,
        related_name="valuation"
    )

    # Raw user-entered values
    raw_pounds = models.PositiveIntegerField(default=0)
    raw_shillings = models.PositiveIntegerField(default=0)
    raw_pence = models.PositiveIntegerField(default=0)

    # Normalized values
    pounds = models.PositiveIntegerField(default=0)
    shillings = models.PositiveIntegerField(default=0)
    pence = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.get_formatted_value()

    def get_formatted_value(self):
        """Return the normalized valuation as a formatted string."""
        return f"£{self.pounds} {self.shillings}s {self.pence}d"

    def get_raw_value(self):
        """Return the value exactly as entered by the user."""
        return f"£{self.raw_pounds} {self.raw_shillings}s {self.raw_pence}d"

    def convert_to_decimal(self):
        """Convert £sd to decimal currency."""
        total_pence = (self.pounds * 240) + (self.shillings * 12) + self.pence
        decimal_value = total_pence / 240  # Convert to modern pounds
        return f"£{decimal_value:.2f}"

    def save(self, *args, **kwargs):
        print(
            f"Raw Values: {self.raw_pounds} pounds, "
            f"{self.raw_shillings} shillings, {self.raw_pence} pence"
        )

        # Normalize values based on raw inputs
        total_pence = (
            (self.raw_pounds * 240) +
            (self.raw_shillings * 12) +
            self.raw_pence
        )
        self.pounds = total_pence // 240
        remaining_pence = total_pence % 240
        self.shillings = remaining_pence // 12
        self.pence = remaining_pence % 12

        print(
            f"Normalized Values: {self.pounds} pounds, "
            f"{self.shillings} shillings, {self.pence} pence"
        )
        super().save(*args, **kwargs)
