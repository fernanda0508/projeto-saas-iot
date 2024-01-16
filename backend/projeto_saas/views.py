from rest_framework import viewsets, status, views
from projeto_saas.models import Sensor, Topicos, Wifi, Mqtt, Placa, Experimento
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from projeto_saas.serializers import (
    UserSerializer,
    SensorSerializer,
    TopicosSerializer,
    WifiSerializer,
    MqttSerializer,
    PlacaSerializer,
    ExperimentoSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Cria o usuário e criptografa a senha automaticamente
        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer


class ExperimentoViewSet(viewsets.ModelViewSet):
    queryset = Experimento.objects.all()
    serializer_class = ExperimentoSerializer


class TopicosViewSet(viewsets.ModelViewSet):
    queryset = Topicos.objects.all()
    serializer_class = TopicosSerializer


class WifiViewSet(viewsets.ModelViewSet):
    queryset = Wifi.objects.all()
    serializer_class = WifiSerializer


class MqttViewSet(viewsets.ModelViewSet):
    queryset = Mqtt.objects.all()
    serializer_class = MqttSerializer


class PlacaViewSet(viewsets.ModelViewSet):
    queryset = Placa.objects.all()
    serializer_class = PlacaSerializer
