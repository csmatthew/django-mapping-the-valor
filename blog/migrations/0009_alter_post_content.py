# Generated by Django 4.2.17 on 2025-01-23 02:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0008_alter_post_created_by_alter_post_last_updated_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='content',
            field=models.TextField(blank=True),
        ),
    ]