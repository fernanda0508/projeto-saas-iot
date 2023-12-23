from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "projeto_saas/", include("projeto_saas.urls")
    ),  # Incluindo as URLs do aplicativo 'meuapp'
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # path(
    #     "api/register/", UserCreate.as_view(), name="user-register"
    # ),
]
