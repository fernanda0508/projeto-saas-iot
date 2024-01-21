import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Button } from '@mui/material';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { createSensorConfiguration, fetchExperimentos, fetchSensores } from "../../../services/api"; // Importe sua função API
import ProtectedRoute from '@/hooks/useRequireAuth';


type InputForm = {
  experimento: string,
  sensor: string[],
  gpio: string,
}

type experimento = {
  id: number,
  tipo_experimento: string
}



const SensorConfigurations = () => {

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<InputForm>()

  const [experimentos, setExperimentos] = useState([]);
  const [sensores, setSensores] = useState([]);
  const [sensoresFiltrados, setSensoresFiltrados] = useState([]);
  const selectedExperiment = watch("experimento");




  useEffect(() => {
    const carregarDados = async () => {
      try {
        const experimentosData = await fetchExperimentos();
        setExperimentos(experimentosData);
        const sensoresData = await fetchSensores();
        setSensores(sensoresData);
      } catch (error) {
        console.error("Erro ao carregar dados da API", error);
      }
    };

    carregarDados();
  }, []);

  console.log({ sensores })


  useEffect(() => {
    if (selectedExperiment) {
      // Filtrar sensores com base no experimento selecionado
      const sensoresRelacionados = sensores.filter((sensor: any) => sensor.experimento_id === selectedExperiment);
      setSensoresFiltrados(sensoresRelacionados);
    } else {
      setSensoresFiltrados([]);
    }
  }, [selectedExperiment, sensores]);

  console.log({ selectedExperiment })


  const onSubmit: SubmitHandler<InputForm> = async (data) => {
    try {
      const response = await createSensorConfiguration(data);
      console.log(response);
      // Aqui você pode redirecionar o usuário ou mostrar alguma mensagem de sucesso
    } catch (error) {
      console.error("Erro ao enviar configuração do sensor:", error);
      // Trate os erros da requisição aqui
    }
  }

  return (
    <ProtectedRoute>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Configurações do Sensor
          </Typography>
          <Controller
            name="experimento"
            control={control}
            defaultValue=""
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="experimento-type-label">Tipo de Experimento</InputLabel>
                <Select
                  {...field}
                  labelId="experimento-type-label"
                  id="experimento-type"
                  label="Tipo de Experimento"
                  error={!!errors.experimento}
                >
                  {experimentos.map((exp: experimento, index: number) => (
                    <MenuItem key={index} value={exp.id}>{exp.tipo_experimento}</MenuItem>
                  ))}

                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="sensor"
            control={control}
            defaultValue={[]}
            rules={{ required: "Selecione pelo menos um sensor" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="sensor-type-label">Tipo de Sensor</InputLabel>
                <Select
                  {...field}
                  multiple
                  labelId="sensor-type-label"
                  id="sensor-type"
                  label="Tipo de Sensor"
                  error={!!errors.sensor}
                >
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
            {...register("gpio", { required: "Este campo é obrigatório" })}
            error={!!errors.gpio}
            helperText={errors.gpio?.message}
          />

          <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>

            <Button variant="contained" type='submit' sx={{}}>Próximo</Button>
          </Box>
        </Paper>
      </Box>
    </ProtectedRoute>


  );
};

export default SensorConfigurations;
