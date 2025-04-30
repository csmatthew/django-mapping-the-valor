from django.db import models


class ReligiousOrder(models.Model):
    religious_order = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.religious_order
