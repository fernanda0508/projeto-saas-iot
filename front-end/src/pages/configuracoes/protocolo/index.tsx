import React, { useState } from 'react';
import { Grid, Container, Typography, TextField, Button, Box, Paper, Divider } from '@mui/material';
import ProtectedRoute from '@/hooks/useRequireAuth';
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from 'react-hook-form';
import { useConfiguracoes } from '@/contexts/ConfigContext';
import converterNumber from '@/components/ConvertNumber';

// Tipagem para os dados do formulário
interface IFormInput {
  id: number;
  host: string;
  porta: string;
  topico: string;
  usuario: string;
  ssid: string;
  senha: string;
}

const ConfiguracoesMqttWifi: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const { enviarConfiguracoesParaAPI, guardarConfiguracoes, configuracoes } = useConfiguracoes();

  const onSubmit = (data: IFormInput) => {
    console.log(user.id)
    // Preparar dados para o MQTT e Wi-Fi
    const dadosMqtt = {
      host: data.host,
      porta: converterNumber(data.porta),
      usuario: user?.id ?? 0,  // Envia o ID do usuário
      placa: configuracoes.sensor?.placa ?? 0   // Usa o ID da placa selecionada anteriormente
    };

    const dadosWifi = {
      ssid: data.ssid,
      senha: data.senha,
      placa: configuracoes.sensor?.placa ?? 0
    };

    // Armazenar no contexto
    guardarConfiguracoes({
      mqtt: dadosMqtt,
      wifi: dadosWifi,
      topicos: [{ topico: data.topico }]  // Tópicos como array
    });

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
                  error={!!errors.host}
                  helperText={errors.host?.message}
                  {...register('host', { required: 'Host MQTT é obrigatório' })}
                />
                <TextField
                  fullWidth
                  label="Porta MQTT"
                  margin="normal"
                  {...register('porta', { required: 'Porta MQTT é obrigatório' })}
                  error={!!errors.porta}
                  helperText={errors.porta?.message}

                />
                <TextField
                  fullWidth
                  label="Tópico MQTT"
                  margin="normal"
                  {...register('topico', { required: 'Tópico MQTT é obrigatório' })}
                  error={!!errors.topico}
                  helperText={errors.topico?.message}
                />
                <TextField
                  fullWidth
                  label="Nome de Usuário MQTT"
                  margin="normal"
                  value={user?.username}
                  InputProps={{
                    readOnly: true,
                  }}
                  {...register('usuario', { required: 'Usuário MQTT é obrigatório' })}
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
                  error={!!errors.ssid}
                  helperText={errors.ssid?.message}
                  {...register('ssid', { required: 'SSID é obrigatório' })}
                />
                <TextField
                  fullWidth
                  label="Senha Wi-Fi"
                  type="password"
                  margin="normal"
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                  {...register('senha', { required: 'Senha do Wi-fi é obrigatório' })}
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
