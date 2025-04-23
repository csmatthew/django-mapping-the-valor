from django.test import TestCase
from django.contrib.auth.models import User
from valor_records.models.valor_record import ValorRecord
from valor_records.models.valuation import Valuation
from valor_records.models.hierarchy import Diocese, Archdeaconry, Deanery


class ValorRecordTestCase(TestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(
            username='testuser',
            password='password'
        )

        # Create a Diocese
        self.diocese = Diocese.objects.create(diocese_name='Test Diocese')

        # Create an Archdeaconry
        self.archdeaconry = Archdeaconry.objects.create(
            archdeaconry_name='Test Archdeaconry',
            diocese=self.diocese  # Associate with the Diocese
        )

        # Create a Deanery
        self.deanery = Deanery.objects.create(
            deanery_name='Test Deanery',
            archdeaconry=self.archdeaconry  # Associate with the Archdeaconry
        )

        # Create a ValorRecord
        self.valor_record = ValorRecord.objects.create(
            name='Test Record',
            record_type='Monastery',
            dedication='Test Dedication',
            deanery=self.deanery,
            created_by=self.user,
            last_edited_by=self.user,
        )

    def test_create_valuation(self):
        # Create a Valuation for the ValorRecord
        valuation = Valuation.objects.create(
            valor_record=self.valor_record,
            pounds=10,
            shillings=5,
            pence=3,
            source='Test Source'
        )

        # Test if the valuation is correctly associated with the ValorRecord
        self.assertEqual(self.valor_record.valuations.count(), 1)
        self.assertEqual(self.valor_record.valuations.first(), valuation)

    def test_get_latest_valuation(self):
        # Create multiple Valuations
        Valuation.objects.create(
            valor_record=self.valor_record,
            pounds=10,
            shillings=5,
            pence=3,
            source='First Source'
        )
        latest_valuation = Valuation.objects.create(
            valor_record=self.valor_record,
            pounds=20,
            shillings=10,
            pence=6,
            source='Latest Source'
        )

        # Test if get_latest_valuation returns the correct valuation
        self.assertEqual(
            self.valor_record.get_latest_valuation(), latest_valuation
        )

    def test_get_all_valuations(self):
        # Create multiple Valuations
        valuation1 = Valuation.objects.create(
            valor_record=self.valor_record,
            pounds=10,
            shillings=5,
            pence=3,
            source='First Source'
        )
        valuation2 = Valuation.objects.create(
            valor_record=self.valor_record,
            pounds=20,
            shillings=10,
            pence=6,
            source='Second Source'
        )

        # Test if get_all_valuations returns all valuations
        all_valuations = self.valor_record.get_all_valuations()
        self.assertIn(valuation1, all_valuations)
        self.assertIn(valuation2, all_valuations)
        self.assertEqual(all_valuations.count(), 2)

    def test_deanery_name(self):
        deanery = Deanery.objects.create(deanery_name="Test Deanery")
        self.assertEqual(deanery.deanery_name, "Test Deanery")
