from django.db import models
from django.contrib.auth.models import User


class Wifi(models.Model):
    ssid = models.CharField(max_length=100)
    senha = models.CharField(
        max_length=128
    )  # Um campo interno para armazenar a senha criptografada


class Mqtt(models.Model):
    host = models.CharField(max_length=100)
    porta = models.IntegerField()
    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="mqtt_users"
    )


class Placa(models.Model):
    modelo = models.CharField(max_length=100)
    wifi = models.OneToOneField(
        Wifi, on_delete=models.CASCADE, related_name="placa_wifi"
    )
    mqtt = models.OneToOneField(Mqtt, on_delete=models.CASCADE)


class Sensor(models.Model):
    tipo = models.CharField(max_length=50)
    pino_gpio = models.IntegerField()
    intervalo_leitura = models.IntegerField()
    placa = models.ForeignKey(Placa, on_delete=models.CASCADE)


class Topicos(models.Model):
    topico = models.CharField(max_length=100, unique=True)
    mqtt = models.ForeignKey(Mqtt, on_delete=models.CASCADE, related_name="topics_mqtt")
