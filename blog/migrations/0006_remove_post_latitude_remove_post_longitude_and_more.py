# Generated by Django 4.2.17 on 2025-01-21 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_post_latitude_post_longitude'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='post',
            name='longitude',
        ),
        migrations.AddField(
            model_name='post',
            name='coordinates',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
