# Generated by Django 4.2.17 on 2025-01-26 08:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0015_alter_post_nearest_town'),
    ]

    operations = [
        migrations.CreateModel(
            name='ApprovedPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('slug', models.SlugField(max_length=200, unique=True)),
                ('nearest_town', models.CharField(blank=True, max_length=200, null=True)),
                ('county', models.CharField(default='Unknown', max_length=200)),
                ('year_founded', models.IntegerField()),
                ('content', models.TextField(blank=True)),
                ('coordinates', models.CharField(blank=True, max_length=50, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('image_url', models.URLField(blank=True, max_length=500, null=True)),
                ('house_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='blog.housetype')),
                ('post', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='approved_version', to='blog.post')),
                ('religious_order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='blog.religiousorder')),
            ],
        ),
    ]
