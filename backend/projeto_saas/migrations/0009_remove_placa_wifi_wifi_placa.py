# Generated by Django 5.0 on 2024-01-21 01:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projeto_saas', '0008_alter_placa_mqtt'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='placa',
            name='wifi',
        ),
        migrations.AddField(
            model_name='wifi',
            name='placa',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='projeto_saas.placa'),
        ),
    ]
