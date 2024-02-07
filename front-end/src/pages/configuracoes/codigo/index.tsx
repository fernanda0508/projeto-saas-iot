// PlacaDetailsComponent.js

import React, { useEffect, useState } from 'react';
import { fetchPlacaDetails } from '@/services/api'; // Substitua pelo caminho correto

const PlacaDetailsComponent = ({ placaId }: number) => {
  const [placaDetails, setPlacaDetails] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPlacaDetails(placaId);
      setPlacaDetails(data);
    };
    loadData();
  }, [placaId]);

  if (!placaDetails) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Detalhes da Placa</h2>
      {/* Renderize as informações da placa como desejar */}
      <p>Modelo: {placaDetails.modelo}</p>
      <p>Modelo: {placaDetails.wifi}</p>
      <p>Modelo: {placaDetails.mqtt}</p>
      {/* Similarmente para WiFi, MQTT, Sensores e Tópicos */}
    </div>
  );
};

export default PlacaDetailsComponent;
