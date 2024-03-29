import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Button, FormHelperText } from '@mui/material';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ProtectedRoute from '@/hooks/useRequireAuth';
import { placaService, sensorService, experimentoService, mqttService } from '@/services/api'; // Atualize as importações aqui
import { useConfiguracoes } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';


type InputForm = {
  id: number,
  tipo_sensor: string,
  pino_gpio: number,
  experimento: number,
  placa: string,
};

type experimento = {
  id: number,
  tipo_experimento: string
}

const SensorConfigurations: React.FC = () => {
  const { user } = useAuth();
  const { control, handleSubmit, watch, register, formState: { errors }, reset } = useForm<InputForm>();
  const [experimentos, setExperimentos] = useState([]);
  const [sensores, setSensores] = useState([]);
  const [tiposSensores, setTiposSensores] = useState([]); // Estado para armazenar os tipos de sensores
  const [sensoresFiltrados, setSensoresFiltrados] = useState([]);
  const [placas, setPlacas] = useState([]);
  const [listMqtt, setListMqtt] = useState([])
  const selectedExperiment = watch("experimento");
  const { guardarConfiguracoes } = useConfiguracoes();
  const placaSelecionada = watch("placa");
  const router = useRouter();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const experimentosResponse = await experimentoService.fetchExperimentos();
        setExperimentos(experimentosResponse.data); // Acessa apenas os dados da resposta

        const tiposSensoresResponse = await sensorService.fetchSensores();
        setTiposSensores(tiposSensoresResponse.data); // Acessa apenas os dados da resposta

        const placasResponse = await placaService.getPlacas();
        setPlacas(placasResponse.data); // Acessa apenas os dados da resposta
        const mqttResponse = await mqttService.fetchMqtt();
        setListMqtt(mqttResponse.data);
        const mqttDoUsuario: any = listMqtt.find((mqtt: any) => mqtt.usuario === user?.id);
        if (mqttDoUsuario) {
          // Usar o 'reset' do react-hook-form para definir os valores padrão do formulário
          reset({
            ...mqttDoUsuario // Supondo que os campos de mqttDoUsuario correspondem aos do formulário
          });
        }
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
      console.log({ data });
      const novaPlaca = {
        modelo: data.placa,
        usuario: user?.id ?? -1
        // Outros campos necessários para a placa, se houver
      };
      console.log(novaPlaca);
      const placaCriada = await placaService.salvarConfiguracao(novaPlaca);

      if (placaCriada && placaCriada.data.id) {
        const dataSensor = {
          tipo_sensor: data.tipo_sensor,
          pino_gpio: Number(data.pino_gpio),
          experimento: data.experimento,
          placa: placaCriada.data.id
        };
        guardarConfiguracoes({ sensor: dataSensor });

        // Mensagem de sucesso
        await Swal.fire({
          title: 'Sucesso!',
          text: 'Placa e configurações do sensor salvas com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        router.push('/configuracoes/protocolo');
      } else {
        // Mensagem de erro
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível criar a placa.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    } catch (error) {
      console.error("Erro ao enviar configuração do sensor:", error);

      // Mensagem de erro
      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao salvar as configurações.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };


  return (
    <ProtectedRoute>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Configurações do Sensor</Typography>

          <Controller
            name="experimento"
            control={control}
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="experimento-label">Tipo de Experimento</InputLabel>
                <Select {...field} labelId="experimento-label" label="Tipo de Experimento" error={!!errors.experimento}>
                  {experimentos.map((exp: experimento, index: number) => (
                    <MenuItem key={index} value={exp.id}>{exp.tipo_experimento}</MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{errors.experimento?.message}</FormHelperText>
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
                <Select {...field} labelId="tipo-sensor-label" label="Tipo de Sensor" error={!!errors.tipo_sensor}>
                  {tiposSensores.map((tipo, index) => (
                    <MenuItem key={index} value={tipo[0]}>{tipo[1]}</MenuItem> // Usar valor e rótulo dos tipos
                  ))}
                </Select>
                <FormHelperText error>{errors.tipo_sensor?.message}</FormHelperText>
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
                  error={!!errors.placa}
                // value={placaSelecionada}
                >
                  {placas.map((placa, index) => (
                    <MenuItem key={index} value={placa[0]}>{placa[1]}</MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{errors.placa?.message}</FormHelperText>
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
