// context/ConfiguracoesContext.tsx
import axios from 'axios';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface Configuracoes {
  sensor?: {
    pino_gpio: number;
    experimento: number;
    placa?: number;
  };
  mqtt?: {
    host: string;
    porta: number;
    usuario: number;
    placa: number;
  };
  wifi?: {
    ssid: string;
    senha: string;
  };
  mqttId?: number;
  topicos?: Array<{ topico: string }>;
}

const ConfiguracoesContext = createContext<{
  configuracoes: Configuracoes;
  guardarConfiguracoes: (novaConfiguracao: Configuracoes) => void;
  enviarConfiguracoesParaAPI: () => Promise<void>;
}>({
  configuracoes: {},
  guardarConfiguracoes: () => { },
  enviarConfiguracoesParaAPI: async () => { },
});

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const ConfiguracoesProvider = ({ children }) => {
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({});

  const guardarConfiguracoes = (novaConfiguracao: Configuracoes) => {
    setConfiguracoes(prevConfiguracoes => ({ ...prevConfiguracoes, ...novaConfiguracao }));
  };

  useEffect(() => {
    const enviarConfiguracoesParaAPI = async () => {
      try {
        if (configuracoes.sensor) {
          const respostaSensor = await api.post('/projeto_saas/sensores/', configuracoes.sensor);
          if (configuracoes.sensor.placa === undefined) {
            configuracoes.sensor.placa = respostaSensor.data.id; // Atualiza o ID da placa no sensor
          }
        }
        if (configuracoes.mqtt) {
          const respostaMqtt = await api.post('/projeto_saas/mqtt/', configuracoes.mqtt);
          configuracoes.mqttId = respostaMqtt.data.id; // Armazena o ID do MQTT para uso com tópicos
        }
        if (configuracoes.wifi) {
          await api.post('/projeto_saas/wifi/', configuracoes.wifi);
        }
        if (configuracoes.mqttId && configuracoes.topicos) {
          for (const topico of configuracoes.topicos) {
            await api.post('/projeto_saas/topicos/', { ...topico, mqtt: configuracoes.mqttId });
          }
        }
        console.log('Configurações enviadas com sucesso');
      } catch (error) {
        console.error('Erro ao enviar configurações:', error);
      }
    };
    if (Object.keys(configuracoes).length > 0) {
      enviarConfiguracoesParaAPI();
    }
  }, [configuracoes]);

  return (
    <ConfiguracoesContext.Provider value={{ configuracoes, guardarConfiguracoes }}>
      {children}
    </ConfiguracoesContext.Provider>
  );
};

export const useConfiguracoes = () => useContext(ConfiguracoesContext);