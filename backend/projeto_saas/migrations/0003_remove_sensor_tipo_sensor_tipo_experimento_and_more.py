# Generated by Django 5.0 on 2024-01-09 01:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projeto_saas', '0002_delete_perfilusuario'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sensor',
            name='tipo',
        ),
        migrations.AddField(
            model_name='sensor',
            name='tipo_experimento',
            field=models.CharField(default='0', max_length=50),
        ),
        migrations.AddField(
            model_name='sensor',
            name='tipo_sensor',
            field=models.CharField(default='0', max_length=50),
        ),
    ]
