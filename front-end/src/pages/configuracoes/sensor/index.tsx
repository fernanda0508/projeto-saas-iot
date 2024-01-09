import React, { useState } from 'react';
import { Box, Paper, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Button } from '@mui/material';
import { useForm, SubmitHandler, Controller } from "react-hook-form"

type InputForm = {
  experimento: string,
  sensor: string[],
  gpio: string,
}

const SensorConfigurations = () => {

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<InputForm>()

  const selectedExperiment = watch("experimento");

  const experimentoSensorsMap: { [key: string]: string[] } = {
    "0": ["DHT11"], // Sensores para Monitoramento temperatura e umidade
    "1": ["Sensor Flame"], // Sensores para Monitoramento de chamas
    "2": ["LED RGB"], // Sensores para Controle de LED RGB
    "3": ["Sensor de Nível de Água", "Módulo Relé"], // Sensores para Acionamento de bombas de agua
  };

  const onSubmit: SubmitHandler<InputForm> = (data) => console.log(data)

  return (

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
                <MenuItem value="0">Monitoramento temperatura e umidade</MenuItem>
                <MenuItem value="1">Monitoramento de chamas</MenuItem>
                <MenuItem value="2">Controle de LED RGB</MenuItem>
                <MenuItem value="3">Acionamento de bombas de agua</MenuItem>
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
                {experimentoSensorsMap[selectedExperiment]?.map((sensor, index) => (
                  <MenuItem key={index} value={sensor}>{sensor}</MenuItem>
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


  );
};

export default SensorConfigurations;
