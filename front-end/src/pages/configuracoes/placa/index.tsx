import React, { useState } from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, Paper } from '@mui/material';

const ConfiguracaoPlaca: React.FC = () => {
  const [modeloPlaca, setModeloPlaca] = useState('');
  const [ssid, setSsid] = useState('');
  const [senhaWifi, setSenhaWifi] = useState('');

  const handleModeloPlacaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setModeloPlaca(event.target.value as string);
  };

  const handleSsidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSsid(event.target.value);
  };

  const handleSenhaWifiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSenhaWifi(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ modeloPlaca, ssid, senhaWifi });
  };

  return (
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="modelo-placa-label">Modelo da Placa</InputLabel>
            <Select
              labelId="modelo-placa-label"
              id="modelo-placa"
              value={modeloPlaca}
              label="Modelo da Placa"
              onChange={handleModeloPlacaChange}
            >
              <MenuItem value="ESP32">ESP32</MenuItem>
              {/* Adicione mais <MenuItem> aqui para outros modelos */}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="ssid"
            label="SSID Wi-Fi"
            name="ssid"
            autoComplete="ssid"
            autoFocus
            value={ssid}
            onChange={handleSsidChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="senhaWifi"
            label="Senha Wi-Fi"
            type="password"
            id="senha-wifi"
            autoComplete="current-password"
            value={senhaWifi}
            onChange={handleSenhaWifiChange}
          />
          <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>

            <Button variant="contained" sx={{}}>Próximo</Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ConfiguracaoPlaca;
