from django.db import models
from django.contrib.auth.models import User


class Wifi(models.Model):
    ssid = models.CharField(max_length=100)
    senha = models.CharField(
        max_length=128
    )  # Campo para armazenar a senha criptografada
    placa = models.ForeignKey("Placa", on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.ssid


class Mqtt(models.Model):
    host = models.CharField(max_length=100)
    porta = models.IntegerField()
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    placa = models.ForeignKey("Placa", on_delete=models.PROTECT, null=True)

    def __str__(self):
        return f"{self.host}:{self.porta}"


class Placa(models.Model):
    MODELO_CHOICES = [
        ("ESP32", "ESP32"),
        ("ARDUINO", "Arduino"),
        # Adicione mais modelos conforme necessário
    ]
    modelo = models.CharField(max_length=100, choices=MODELO_CHOICES, default="")
    usuario = models.ForeignKey(
        User,
        null=True,
        on_delete=models.CASCADE,
        related_name="placa_user",
    )

    def __str__(self):
        return self.get_modelo_display()  # Retorna a representação legível do modelo


class Experimento(models.Model):
    tipo_experimento = models.CharField(max_length=50, default="")

    def __str__(self):
        return self.tipo_experimento


class Sensor(models.Model):
    SENSOR_CHOICES = [
        ("FLAME", "Sensor de Chamas"),
        ("DHT11", "Sensor de Temp/Umidade"),
        # Adicione mais opções conforme necessário
    ]
    tipo_sensor = models.CharField(
        max_length=50,
        choices=SENSOR_CHOICES,
        default="",  # Um valor padrão, se necessário
    )
    experimento = models.ForeignKey(Experimento, on_delete=models.CASCADE, null=True)
    pino_gpio = models.IntegerField()
    # intervalo_leitura = models.IntegerField()
    placa = models.ForeignKey(Placa, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.tipo_sensor} - GPIO: {self.pino_gpio}"


class Topicos(models.Model):
    topico = models.CharField(max_length=100, unique=True)
    mqtt = models.ForeignKey(Mqtt, on_delete=models.CASCADE)

    def __str__(self):
        return self.topico
