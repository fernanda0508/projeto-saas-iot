from django.contrib import admin
from projeto_saas.models import Sensor, Topicos, Wifi, Mqtt, Placa, Experimento


# Opcional: Personalizar a aparência no admin
class SensorAdmin(admin.ModelAdmin):
    list_display = ("tipo_sensor", "pino_gpio", "placa")
    list_filter = (
        "tipo_sensor",
        "placa",
    )
    search_fields = ("tipo",)


class TopicosAdmin(admin.ModelAdmin):
    list_display = ("topico", "mqtt")
    list_filter = ("mqtt",)
    search_fields = ("topico",)


class WifiAdmin(admin.ModelAdmin):
    list_display = ("ssid", "senha", "placa")
    search_fields = ("ssid",)


class MqttAdmin(admin.ModelAdmin):
    list_display = ("host", "porta", "usuario", "placa")
    list_filter = ("usuario",)
    search_fields = ("host",)


class PlacaAdmin(admin.ModelAdmin):
    list_display = ("modelo",)
    list_filter = ("modelo",)
    search_fields = ("modelo",)


# Registrar modelos com a personalização, se houver
admin.site.register(Sensor, SensorAdmin)
admin.site.register(Topicos, TopicosAdmin)
admin.site.register(Wifi, WifiAdmin)
admin.site.register(Mqtt, MqttAdmin)
admin.site.register(Placa, PlacaAdmin)
admin.site.register(Experimento)
