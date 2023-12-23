from rest_framework import serializers
from projeto_saas.models import Sensor, Topicos, Wifi, Mqtt, Placa
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
        fields = "__all__"


class TopicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topicos
        fields = "__all__"


class WifiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wifi
        fields = "__all__"


class MqttSerializer(serializers.ModelSerializer):
    usuario = UserSerializer()

    class Meta:
        model = Mqtt
        fields = "__all__"


class PlacaSerializer(serializers.ModelSerializer):
    wifi = WifiSerializer()
    mqtt = MqttSerializer()

    class Meta:
        model = Placa
        fields = "__all__"
