// services/api.ts
import axios from "axios";

// Configuração inicial do Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // Substitua pela URL base do seu backend Django
});

// Interceptor para incluir o token de acesso em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funções para os endpoints de autenticação
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post("/api/token/", { username, password });
    return response.data;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  },
  register: async (username: string, email: string, password: string) => {
    const response = await api.post("/projeto_saas/users/", {
      username,
      email,
      password,
    });
    return response.data;
  },
};

// Função separada para obter o perfil do usuário
export const getUserProfile = async () => {
  const response = await api.get("/projeto_saas/users/me/");
  return response.data;
};

export const placaService = {
  salvarConfiguracao: async (modeloPlaca: string) => {
    const response = await api.post("/projeto_saas/placas/", {
      modelo_placa: modeloPlaca,
    });
    return response.data;
  },

  getPlacas: async () => {
    const response = await api.get("/projeto_saas/placas/");
    return response.data;
  },
};

export const createSensorConfiguration = async (configurationData: any) => {
  const response = await api.post("/projeto_saas/sensores/", configurationData);
  return response.data;
};

export const fetchExperimentos = async () => {
  const response = await api.get("/projeto_saas/experimentos/");
  return response.data;
};

export const fetchSensores = async () => {
  const response = await api.get("/projeto_saas/sensores/tipos/");
  return response.data;
};

export default api;
