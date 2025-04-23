from django.db import models


class HouseType(models.Model):
    HOUSE_TYPE_CHOICES_DICT = {
        1: 'Abbey',
        2: 'Priory',
        3: 'Nunnery',
    }

    HOUSE_TYPE_CHOICES = [
        (key, value) for key, value in HOUSE_TYPE_CHOICES_DICT.items()
    ]

    house_type = models.CharField(
        max_length=50, choices=HOUSE_TYPE_CHOICES
    )

    def __str__(self):
        return self.get_house_type_display()
