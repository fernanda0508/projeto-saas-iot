import React from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, Paper } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import ProtectedRoute from '@/hooks/useRequireAuth';

type InputForm = {
  modeloPlaca: string;
  ssid: string;
  senhaWifi: string;
}

const ConfiguracaoPlaca: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<InputForm>();

  const onSubmit = (data: InputForm) => {
    console.log(data);
  };

  return (
    <ProtectedRoute>
      <Paper elevation={2}>
        <Box
          sx={{
            p: 2,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Configuração da Placa
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Controller
              name="modeloPlaca"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="modelo-placa-label">Modelo da Placa</InputLabel>
                  <Select
                    {...field}
                    labelId="modelo-placa-label"
                    id="modelo-placa"
                    label="Modelo da Placa"
                    error={!!errors.modeloPlaca}
                  >
                    <MenuItem value="ESP32">ESP32</MenuItem>
                    {/* Adicione mais <MenuItem> aqui para outros modelos */}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="ssid"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="ssid"
                  label="SSID Wi-Fi"
                  name="ssid"
                  autoComplete="ssid"
                  autoFocus
                  error={!!errors.ssid}
                />
              )}
            />
            <Controller
              name="senhaWifi"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  name="senhaWifi"
                  label="Senha Wi-Fi"
                  type="password"
                  id="senha-wifi"
                  autoComplete="current-password"
                  error={!!errors.senhaWifi}
                />
              )}
            />
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
              <Button type="submit" variant="contained">Próximo</Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </ProtectedRoute>
  );
};

export default ConfiguracaoPlaca;
