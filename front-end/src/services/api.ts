// services/api.ts
import axios from "axios";

// Configuração inicial do Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // Substitua pela URL base do seu backend
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

export const authService = {
  login: (username: string, password: string) =>
    api.post("/api/token/", { username, password }),
  refreshToken: (refreshToken: string) =>
    api.post("/api/token/refresh/", { refresh: refreshToken }),
  register: (username: string, email: string, password: string) =>
    api.post("/projeto_saas/users/", { username, email, password }),
};

export const userProfileService = {
  getProfile: () => api.get("/projeto_saas/users/me/"),
};

export const placaService = {
  salvarConfiguracao: (modeloPlaca: { modelo: string; usuario: number }) =>
    api.post("/projeto_saas/placas/", modeloPlaca),
  getPlacas: () => api.get("/projeto_saas/placas/tipos/"),
  fetchPlacaDetails: (placaId: number) =>
    api.get(`/projeto_saas/placa/${placaId}/`),
  createNewPlaca: (dadosPlaca: Object) =>
    api.post("/projeto_saas/placas/", dadosPlaca),
};

export const sensorService = {
  createConfiguration: (configurationData: any) =>
    api.post("/projeto_saas/sensores/", configurationData),
  fetchSensores: () => api.get("/projeto_saas/sensores/tipos/"),
};

export const experimentoService = {
  fetchExperimentos: () => api.get("/projeto_saas/experimentos/"),
};

export const mqttService = {
  fetchMqtt: () => api.get("/projeto_saas/mqtt/"),
};

export default api;
