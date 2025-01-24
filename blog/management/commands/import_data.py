# blog/management/commands/import_data.py
import csv
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from blog.models import Post, ReligiousOrder, HouseType

class Command(BaseCommand):
    help = 'Import data from a CSV file'

    def handle(self, *args, **kwargs):
        with open('data_import_manage/Cistercian Abbeys - Sheet12.csv', 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                religious_order, _ = ReligiousOrder.objects.get_or_create(name=row['religious_order'])
                house_type, _ = HouseType.objects.get_or_create(name=row['house_type'])
                slug = slugify(row['name'])
                # Ensure the slug is unique
                original_slug = slug
                counter = 1
                while Post.objects.filter(slug=slug).exists():
                    slug = f"{original_slug}-{counter}"
                    counter += 1
                post, created = Post.objects.update_or_create(
                    name=row['name'],
                    defaults={
                        'slug': slug,
                        'religious_order': religious_order,
                        'house_type': house_type,
                        'nearest_town': row['nearest_town'],
                        'county': row['county'],
                        'year_founded': row['year_founded'],
                        'content': row['content'],
                        'coordinates': row['coordinates'],
                        'status': 2,
                    }
                )
        self.stdout.write(self.style.SUCCESS('Data imported successfully'))