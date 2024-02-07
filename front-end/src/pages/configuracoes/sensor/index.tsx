import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Button } from '@mui/material';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ProtectedRoute from '@/hooks/useRequireAuth';
import { placaService, fetchExperimentos, fetchSensores } from '@/services/api';
import { useConfiguracoes } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';

type InputForm = {
  id: number,
  tipo_sensor: string,
  pino_gpio: number,
  experimento: number,
  placa: string,
};

const SensorConfigurations: React.FC = () => {
  const { user } = useAuth();
  const { control, handleSubmit, watch, register, formState: { errors } } = useForm<InputForm>();
  const [experimentos, setExperimentos] = useState([]);
  const [sensores, setSensores] = useState([]);
  const [tiposSensores, setTiposSensores] = useState([]); // Estado para armazenar os tipos de sensores
  const [sensoresFiltrados, setSensoresFiltrados] = useState([]);
  const [placas, setPlacas] = useState([]);
  const selectedExperiment = watch("experimento");
  const { guardarConfiguracoes } = useConfiguracoes();
  const placaSelecionada = watch("placa");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const experimentosData = await fetchExperimentos();
        setExperimentos(experimentosData);
        const tiposSensoresData = await fetchSensores();
        // setSensores(sensoresData);
        setTiposSensores(tiposSensoresData);
        const placasData = await placaService.getPlacas();
        setPlacas(placasData);
      } catch (error) {
        console.error("Erro ao carregar dados da API", error);
      }
    };

    carregarDados();
  }, []);

  console.log("Usuárioooooo", user?.id)

  useEffect(() => {
    if (selectedExperiment) {
      const sensoresRelacionados = sensores.filter((sensor: InputForm) => sensor.experimento === selectedExperiment);
      setSensoresFiltrados(sensoresRelacionados);
    } else {
      setSensoresFiltrados([]);
    }
  }, [selectedExperiment, sensores]);


  const onSubmit: SubmitHandler<InputForm> = async (data) => {
    try {
      console.log({ data })
      // Cria a placa primeiro
      const novaPlaca = {
        modelo: data.placa,
        usuario: user?.id ?? -1// Supondo que você tenha um campo para o modelo da placa
        // Outros campos necessários para a placa, se houver
      };
      console.log(novaPlaca)
      const placaCriada = await placaService.salvarConfiguracao(novaPlaca);

      // Verifique se a placa foi criada com sucesso
      if (placaCriada && placaCriada.id) {
        const dataSensor = {
          tipo_sensor: data.tipo_sensor,
          pino_gpio: Number(data.pino_gpio),
          experimento: data.experimento,
          placa: placaCriada.id
        };
        guardarConfiguracoes({ sensor: dataSensor });

        // Aqui você pode redirecionar para a próxima página ou continuar o fluxo
      } else {
        console.error("Erro ao criar placa");
      }
    } catch (error) {
      console.error("Erro ao enviar configuração do sensor:", error);
    }
  };


  console.log(placaSelecionada)


  return (
    <ProtectedRoute>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Configurações do Sensor</Typography>

          <Controller
            name="experimento"
            control={control}
            defaultValue=""
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="experimento-label">Tipo de Experimento</InputLabel>
                <Select {...field} labelId="experimento-label" label="Tipo de Experimento">
                  {experimentos.map((exp, index) => (
                    <MenuItem key={index} value={exp.id}>{exp.tipo_experimento}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="tipo_sensor"
            control={control}
            defaultValue=""
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="tipo-sensor-label">Tipo de Sensor</InputLabel>
                <Select {...field} labelId="tipo-sensor-label" label="Tipo de Sensor">
                  {tiposSensores.map((tipo, index) => (
                    <MenuItem key={index} value={tipo[0]}>{tipo[1]}</MenuItem> // Usar valor e rótulo dos tipos
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <TextField
            fullWidth
            label="Pino GPIO"
            margin="normal"
            {...register("pino_gpio", { required: "Este campo é obrigatório" })}
            error={!!errors.pino_gpio}
            helperText={errors.pino_gpio?.message}
          />

          <Controller
            name="placa"
            control={control}
            defaultValue=""
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="placa-label">Modelo da Placa</InputLabel>
                <Select
                  {...field}
                  labelId="placa-label"
                  label="Modelo da Placa"
                // value={placaSelecionada}
                >
                  {placas.map((placa, index) => (
                    <MenuItem key={index} value={placa[0]}>{placa[1]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
            <Button variant="contained" type="submit">Próximo</Button>
          </Box>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
};

export default SensorConfigurations;
