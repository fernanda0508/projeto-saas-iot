from rest_framework import serializers
from projeto_saas.models import Sensor, Topicos, Wifi, Mqtt, Placa, Experimento
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


# no serializer do sensor não está vindo o experimento_id nem o placa_id, por que ? como faço aparecer?
class SensorSerializer(serializers.ModelSerializer):
    placa_id = serializers.PrimaryKeyRelatedField(
        queryset=Placa.objects.all(), source="placa"
    )
    experimento_id = serializers.PrimaryKeyRelatedField(
        queryset=Experimento.objects.all(), source="experimento"
    )

    class Meta:
        model = Sensor
        fields = [
            "id",
            "tipo_sensor",
            "pino_gpio",
            "intervalo_leitura",
            "placa_id",
            "experimento_id",
        ]

    def create(self, validated_data):
        # O método pop() é usado para obter e remover os dados da placa e do experimento dos dados validados.
        placa_data = validated_data.pop("placa")
        experimento_data = validated_data.pop("experimento")

        # Cria a instância do Sensor com os dados da placa e do experimento.
        sensor_instance = Sensor.objects.create(
            placa=placa_data, experimento=experimento_data, **validated_data
        )

        return sensor_instance


class TopicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topicos
        fields = "__all__"


class ExperimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experimento
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
    class Meta:
        model = Placa
        fields = ["id", "modelo"]

    def create(self, validated_data):
        placa_instance = Placa.objects.create(**validated_data)
        return placa_instance
