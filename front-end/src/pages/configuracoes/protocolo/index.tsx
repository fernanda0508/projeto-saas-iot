import React, { useState } from 'react';
import { Grid, Container, Typography, TextField, Button, Box, Paper, Divider } from '@mui/material';
import ProtectedRoute from '@/hooks/useRequireAuth';

const ConfiguracoesMqttWifi: React.FC = () => {
  const [hostMqtt, setHostMqtt] = useState('');
  const [portaMqtt, setPortaMqtt] = useState('');
  const [topicoMqtt, setTopicoMqtt] = useState('');
  const [usuarioMqtt, setUsuarioMqtt] = useState('');
  const [senhaMqtt, setSenhaMqtt] = useState('');
  const [ssid, setSsid] = useState('');
  const [senhaWifi, setSenhaWifi] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Trate o envio do formulário aqui
    console.log({
      hostMqtt,
      portaMqtt,
      topicoMqtt,
      usuarioMqtt,
      senhaMqtt,
      ssid,
      senhaWifi,
    });
  };

  return (
    <ProtectedRoute>
      <Container component="main" maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" sx={{ mb: 6 }} gutterBottom>
            Configurações MQTT e Wi-Fi
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Configurações MQTT
                </Typography>
                <TextField
                  fullWidth
                  label="Host MQTT"
                  value={hostMqtt}
                  onChange={(e) => setHostMqtt(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Porta MQTT"
                  value={portaMqtt}
                  onChange={(e) => setPortaMqtt(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Tópico MQTT"
                  value={topicoMqtt}
                  onChange={(e) => setTopicoMqtt(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Nome de Usuário MQTT"
                  value={usuarioMqtt}
                  onChange={(e) => setUsuarioMqtt(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Senha MQTT"
                  type="password"
                  value={senhaMqtt}
                  onChange={(e) => setSenhaMqtt(e.target.value)}
                  margin="normal"
                />
              </Grid>

              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

              <Grid item xs={12} md={5}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Configurações Wi-Fi
                </Typography>
                <TextField
                  fullWidth
                  label="SSID"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Senha Wi-Fi"
                  type="password"
                  value={senhaWifi}
                  onChange={(e) => setSenhaWifi(e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4 }}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Gerar Código
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
};

export default ConfiguracoesMqttWifi;
