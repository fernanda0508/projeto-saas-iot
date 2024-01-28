import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Button } from '@mui/material';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ProtectedRoute from '@/hooks/useRequireAuth';
import { placaService, fetchExperimentos, fetchSensores } from '@/services/api';
import { useConfiguracoes } from '@/contexts/ConfigContext';

type InputForm = {
  id: number,
  tipo_sensor: string,
  pino_gpio: number,
  experimento: number,
  placa: number,
};

const SensorConfigurations: React.FC = () => {
  const { control, handleSubmit, watch, register, formState: { errors } } = useForm<InputForm>();
  const [experimentos, setExperimentos] = useState([]);
  const [sensores, setSensores] = useState([]);
  const [sensoresFiltrados, setSensoresFiltrados] = useState([]);
  const [placas, setPlacas] = useState([]);
  const selectedExperiment = watch("experimento");
  const { guardarConfiguracoes } = useConfiguracoes();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const experimentosData = await fetchExperimentos();
        setExperimentos(experimentosData);
        const sensoresData = await fetchSensores();
        setSensores(sensoresData);
        const placasData = await placaService.getPlacas();
        setPlacas(placasData);
      } catch (error) {
        console.error("Erro ao carregar dados da API", error);
      }
    };

    carregarDados();
  }, []);

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

      const dataModificado = {
        id: Number(data.tipo_sensor),
        pino_gpio: Number(data.pino_gpio),
        experimento: data.experimento,
        placa: data.placa
      }
      guardarConfiguracoes({ sensor: dataModificado });
      console.log("Dados do sensor armazenados", dataModificado);
    } catch (error) {
      console.error("Erro ao enviar configuração do sensor:", error);
    }
  };

  // console.log({ sensores })

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
                  {sensoresFiltrados.map((sensor, index) => (
                    <MenuItem key={index} value={sensor.id}>{sensor.tipo_sensor}</MenuItem>
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
                <Select {...field} labelId="placa-label" label="Modelo da Placa">
                  {placas.map((placa, index) => (
                    <MenuItem key={index} value={placa.id}>{placa.modelo}</MenuItem>
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
