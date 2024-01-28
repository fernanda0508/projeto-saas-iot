from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    SensorViewSet,
    TopicosViewSet,
    WifiViewSet,
    MqttViewSet,
    PlacaViewSet,
    ExperimentoViewSet,
)

router = DefaultRouter()
# router.register(r"users", UserSerializer)
# router.register(r"perfilusuario", PerfilUsuarioViewSet)
router.register(r"users", UserViewSet)
router.register(r"sensores", SensorViewSet)
router.register(r"experimentos", ExperimentoViewSet)
router.register(r"topicos", TopicosViewSet)
router.register(r"wifi", WifiViewSet)
router.register(r"mqtt", MqttViewSet)
router.register(r"placas", PlacaViewSet)
# router.register(r"configuracoes", ConfiguracoesViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
