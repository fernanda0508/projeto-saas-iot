# Generated by Django 5.0 on 2024-01-21 00:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projeto_saas', '0006_alter_experimento_tipo_experimento_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='placa',
            name='wifi',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='placa_wifi', to='projeto_saas.wifi'),
        ),
    ]