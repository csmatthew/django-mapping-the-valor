from django.test import TestCase, RequestFactory
from valor_records.views import add_valor_record
from valor_records.models import Diocese, Archdeaconry, Deanery


class AddValorRecordTest(TestCase):
    def setUp(self):
        # Create an Diocese for testing
        self.diocese = Diocese.objects.create(
            diocese_name="York"
        )

        # Create an Archdeaconry for testing
        self.archdeaconry = Archdeaconry.objects.create(
            archdeaconry_name="York",
            diocese=self.diocese
        )

        # Create a Deanery for testing
        self.deanery = Deanery.objects.create(
            deanery_name="York",
            archdeaconry=self.archdeaconry
        )
        self.factory = RequestFactory()

    def test_add_valor_record(self):
        # Create a mock POST request
        request = self.factory.post(
            "/valor-records/add/",
            {
                "name": "Test Record",
                "record_type": "Rectory",
                "latitude": 54.1234,
                "longitude": -1.2345,
                "dedication": "Saint John",
                "deanery": "York",
            },
            content_type="application/json"
        )
        # Call the view
        response = add_valor_record(request)
        # Assert the response
        self.assertEqual(response.status_code, 201)
        self.assertIn(b"Record added successfully!", response.content)
