# Generated by Django 5.0 on 2024-01-13 02:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projeto_saas', '0003_remove_sensor_tipo_sensor_tipo_experimento_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sensor',
            name='tipo_experimento',
            field=models.CharField(default='Monitoramento de chamas', max_length=50),
        ),
        migrations.AlterField(
            model_name='sensor',
            name='tipo_sensor',
            field=models.CharField(default='Sensor Flame', max_length=50),
        ),
    ]
