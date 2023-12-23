import React, { useState } from 'react';
import { Box, Paper, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Button } from '@mui/material';

const SensorConfigurations = () => {
  const [sensorType, setSensorType] = useState('');
  const [gpioPin, setGpioPin] = useState('');
  const [readInterval, setReadInterval] = useState('');

  const handleSensorTypeChange = (event) => {
    setSensorType(event.target.value);
  };

  return (
    <Box sx={{ p: 2 }} component={Paper} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Configurações do Sensor
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="sensor-type-label">Tipo de Sensor</InputLabel>
        <Select
          labelId="sensor-type-label"
          id="sensor-type"
          value={sensorType}
          label="Tipo de Sensor"
          onChange={handleSensorTypeChange}
        >
          <MenuItem value="temperature">Temperatura</MenuItem>
          {/* Adicione mais MenuItem aqui para outros tipos de sensores */}
        </Select>
      </FormControl>
      <TextField
        label="Pino GPIO"
        margin="normal"
        fullWidth
        value={gpioPin}
        onChange={(e) => setGpioPin(e.target.value)}
      />
      <TextField
        label="Intervalo de Leitura (em segundos)"
        margin="normal"
        fullWidth
        value={readInterval}
        onChange={(e) => setReadInterval(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>

        <Button variant="contained" sx={{}}>Próximo</Button>
      </Box>
    </Box>
  );
};

export default SensorConfigurations;
