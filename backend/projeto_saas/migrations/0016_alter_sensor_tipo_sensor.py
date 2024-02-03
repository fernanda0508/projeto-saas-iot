# Generated by Django 5.0 on 2024-01-30 01:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projeto_saas', '0015_delete_configuracao'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sensor',
            name='tipo_sensor',
            field=models.CharField(choices=[('FLAME', 'Sensor de Chamas'), ('DHT11', 'Sensor de Temp/Umidade')], default='', max_length=50),
        ),
    ]
