from django.db import models


class RecordType(models.Model):
    record_type = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.record_type
