# Generated by Django 5.0 on 2024-01-26 02:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projeto_saas', '0014_remove_sensor_intervalo_leitura'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Configuracao',
        ),
    ]
