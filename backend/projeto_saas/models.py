from django.db import models
from django.contrib.auth.models import User


class Wifi(models.Model):
    ssid = models.CharField(max_length=100)
    senha = models.CharField(
        max_length=128
    )  # Campo para armazenar a senha criptografada

    def __str__(self):
        return self.ssid


class Mqtt(models.Model):
    host = models.CharField(max_length=100)
    porta = models.IntegerField()
    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="mqtt_users"
    )

    def __str__(self):
        return f"{self.host}:{self.porta}"


class Placa(models.Model):
    modelo = models.CharField(max_length=100)
    wifi = models.OneToOneField(
        Wifi, on_delete=models.CASCADE, related_name="placa_wifi"
    )
    mqtt = models.OneToOneField(Mqtt, on_delete=models.CASCADE)

    def __str__(self):
        return self.modelo


class Experimento(models.Model):
    tipo_experimento = models.CharField(max_length=50, default="")

    def __str__(self):
        return self.tipo_experimento


class Sensor(models.Model):
    tipo_sensor = models.CharField(max_length=50, default="")
    experimento = models.ForeignKey(Experimento, on_delete=models.CASCADE, null=True)
    pino_gpio = models.IntegerField()
    intervalo_leitura = models.IntegerField()
    placa = models.ForeignKey(Placa, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.tipo_sensor} - GPIO: {self.pino_gpio}"


class Topicos(models.Model):
    topico = models.CharField(max_length=100, unique=True)
    mqtt = models.ForeignKey(Mqtt, on_delete=models.CASCADE, related_name="topics_mqtt")

    def __str__(self):
        return self.topico
