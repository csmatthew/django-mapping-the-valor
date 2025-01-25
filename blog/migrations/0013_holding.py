# Generated by Django 4.2.17 on 2025-01-25 04:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0012_post_image_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='Holding',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('location', models.CharField(max_length=200)),
                ('value_pounds', models.IntegerField(default=0)),
                ('value_shillings', models.IntegerField(default=0)),
                ('value_pence', models.IntegerField(default=0)),
                ('monastery', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='holdings', to='blog.post')),
            ],
        ),
    ]
