from django.db import models


class Diocese(models.Model):
    diocese_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.diocese_name

    class Meta:
        verbose_name_plural = 'dioceses'


class Archdeaconry(models.Model):
    archdeaconry_name = models.CharField(max_length=255, unique=True)
    diocese = models.ForeignKey(
        Diocese,
        on_delete=models.CASCADE,
        related_name="archdeaconries"
    )

    def __str__(self):
        return self.archdeaconry_name

    class Meta:
        verbose_name_plural = 'archdeaconries'


class Deanery(models.Model):
    deanery_name = models.CharField(max_length=255, unique=True)
    archdeaconry = models.ForeignKey(
        Archdeaconry,
        on_delete=models.CASCADE,
        related_name="deaneries"
    )

    def __str__(self):
        return self.deanery_name

    class Meta:
        verbose_name_plural = 'deaneries'
