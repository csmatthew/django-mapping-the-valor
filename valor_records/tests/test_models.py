from django.test import TestCase
from valor_records.models.hierarchy import Diocese, Archdeaconry, Deanery


class DioceseModelTest(TestCase):
    def test_diocese_creation(self):
        diocese = Diocese.objects.create(diocese_name="Diocese of Canterbury")
        self.assertEqual(diocese.diocese_name, "Diocese of Canterbury")


class ArchdeaconryModelTest(TestCase):
    def test_archdeaconry_creation(self):
        diocese = Diocese.objects.create(diocese_name="Diocese of Canterbury")
        archdeaconry = Archdeaconry.objects.create(
            archdeaconry_name="Archdeaconry of Maidstone", diocese=diocese
        )
        self.assertEqual(
            archdeaconry.archdeaconry_name, "Archdeaconry of Maidstone"
        )
        self.assertEqual(archdeaconry.diocese, diocese)


class DeaneryModelTest(TestCase):
    def test_deanery_creation(self):
        diocese = Diocese.objects.create(diocese_name="Diocese of Canterbury")
        archdeaconry = Archdeaconry.objects.create(
            archdeaconry_name="Archdeaconry of Maidstone", diocese=diocese
        )
        deanery = Deanery.objects.create(
            deanery_name="Deanery of North Maidstone",
            archdeaconry=archdeaconry
        )
        self.assertEqual(deanery.deanery_name, "Deanery of North Maidstone")
        self.assertEqual(deanery.archdeaconry, archdeaconry)
