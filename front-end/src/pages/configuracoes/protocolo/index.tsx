import React, { useState } from 'react';
import { Grid, Container, Typography, TextField, Button, Box, Paper, Divider } from '@mui/material';
import ProtectedRoute from '@/hooks/useRequireAuth';
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from 'react-hook-form';

// Tipagem para os dados do formulário
interface IFormInput {
  hostMqtt: string;
  portaMqtt: string;
  topicoMqtt: string;
  usuarioMqtt: string;
  senhaMqtt: string;
  ssid: string;
  senhaWifi: string;
}

const ConfiguracoesMqttWifi: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();


  const onSubmit = (data: IFormInput) => {
    console.log(data);
    // Trate o envio do formulário aqui
  };

  return (
    <ProtectedRoute>
      <Container component="main" maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }} >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5" align="center" sx={{ mb: 6 }} gutterBottom>
              Configurações MQTT e Wi-Fi
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Configurações MQTT
                </Typography>
                <TextField
                  fullWidth
                  label="Host MQTT"
                  margin="normal"
                  {...register('hostMqtt', { required: 'Host MQTT é obrigatório' })}
                />
                <TextField
                  fullWidth
                  label="Porta MQTT"
                  margin="normal"
                  {...register('portaMqtt', { required: 'Porta MQTT é obrigatório' })}

                />
                <TextField
                  fullWidth
                  label="Tópico MQTT"
                  margin="normal"
                  {...register('topicoMqtt', { required: 'Tópico MQTT é obrigatório' })}

                />
                <TextField
                  fullWidth
                  label="Nome de Usuário MQTT"
                  margin="normal"
                  value={user?.username}
                  {...register('usuarioMqtt', { required: 'Usuário MQTT é obrigatório' })}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Typography variant="caption" style={{ color: 'gray' }}>
                  O usuário definido aqui é o mesmo utilizado no seu cadastro.
                </Typography>
                <TextField
                  fullWidth
                  label="Senha MQTT"
                  type="password"
                  value={"**********"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Typography variant="caption" style={{ color: 'gray' }}>
                  A senha definida aqui é a mesma utilizada no seu cadastro.
                </Typography>
              </Grid>

              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

              <Grid item xs={12} md={5}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Configurações Wi-Fi
                </Typography>
                <TextField
                  fullWidth
                  label="SSID"
                  margin="normal"
                  {...register('ssid', { required: 'SSID é obrigatório' })}
                />
                <TextField
                  fullWidth
                  label="Senha Wi-Fi"
                  type="password"
                  margin="normal"
                  {...register('senhaWifi', { required: 'Senha do Wi-fi é obrigatório' })}
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
