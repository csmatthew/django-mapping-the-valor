# Generated by Django 4.2.17 on 2025-01-28 09:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='HouseType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('monastery_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200, unique=True)),
                ('slug', models.SlugField(blank=True, max_length=200, null=True, unique=True)),
                ('county', models.CharField(default='Unknown', max_length=200)),
                ('year_founded', models.IntegerField()),
                ('content', models.TextField(blank=True)),
                ('coordinates', models.CharField(blank=True, max_length=50, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('status', models.IntegerField(choices=[(0, 'Draft'), (1, 'Pending Approval'), (2, 'Published')], default=0)),
                ('image_url', models.URLField(blank=True, max_length=500, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_posts', to=settings.AUTH_USER_MODEL)),
                ('house_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='blog.housetype')),
                ('last_updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='updated_posts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FinancialDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('holding_title', models.CharField(blank=True, max_length=200, null=True)),
                ('holding_pounds', models.DecimalField(blank=True, decimal_places=0, max_digits=10, null=True)),
                ('holding_shillings', models.DecimalField(blank=True, decimal_places=0, max_digits=10, null=True)),
                ('holding_pence', models.DecimalField(blank=True, decimal_places=0, max_digits=10, null=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='financial_details', to='blog.post')),
            ],
        ),
        migrations.CreateModel(
            name='ApprovedPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('slug', models.SlugField(max_length=200, unique=True)),
                ('county', models.CharField(default='Unknown', max_length=200)),
                ('year_founded', models.IntegerField()),
                ('content', models.TextField(blank=True)),
                ('coordinates', models.CharField(blank=True, max_length=50, null=True)),
                ('image_url', models.URLField(blank=True, max_length=500, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('house_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='blog.housetype')),
                ('post', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='approved_version', to='blog.post')),
            ],
        ),
    ]
