from django.db import models


class ReligiousOrder(models.Model):
    RELIGIOUS_ORDER_CHOICES_DICT = {
        1: 'Augustinian',
        2: 'Benedictine',
        3: 'Carthusian',
        4: 'Cistercian',
        5: 'Cluniac',
        6: 'Dominican',
        7: 'Franciscan',
        8: 'Gilbertine',
        9: 'Knights Hospitaller',
        10: 'Premonstratensian',
        11: 'Trinitarian',
    }

    RELIGIOUS_ORDER_CHOICES = [
        (key, value) for key, value in RELIGIOUS_ORDER_CHOICES_DICT.items()
    ]

    religious_order = models.IntegerField(
        choices=RELIGIOUS_ORDER_CHOICES
    )

    def __str__(self):
        return self.get_religious_order_display()
