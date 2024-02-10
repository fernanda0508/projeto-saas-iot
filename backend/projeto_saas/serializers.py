from rest_framework import serializers
from projeto_saas.models import (
    Sensor,
    Topicos,
    Wifi,
    Mqtt,
    Placa,
    Experimento,
)
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Criptografar a senha ao criar um novo usuário
        validated_data["password"] = make_password(validated_data.get("password"))
        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        # Criptografar a senha ao atualizar o usuário
        instance.password = make_password(
            validated_data.get("password", instance.password)
        )
        instance.save()
        return instance


# class PerfilUsuarioSerializer(serializers.ModelSerializer):
#     user = UserSerializer()

#     class Meta:
#         model = PerfilUsuario
#         fields = "__all__"


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ["id", "tipo_sensor", "pino_gpio", "experimento", "placa"]


class TopicosSerializer(serializers.ModelSerializer):
    mqtt = serializers.PrimaryKeyRelatedField(queryset=Mqtt.objects.all())

    class Meta:
        model = Topicos
        fields = "__all__"


class ExperimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experimento
        fields = "__all__"


class WifiSerializer(serializers.ModelSerializer):
    placa = serializers.PrimaryKeyRelatedField(
        queryset=Placa.objects.all(), allow_null=True
    )

    class Meta:
        model = Wifi
        fields = "__all__"


class MqttSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Mqtt
        fields = ["id", "host", "porta", "usuario", "placa"]


class PlacaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placa
        fields = ["id", "modelo", "usuario"]

    def create(self, validated_data):
        placa_instance = Placa.objects.create(**validated_data)
        return placa_instance
