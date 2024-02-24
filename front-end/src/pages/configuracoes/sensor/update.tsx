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
  const [Dados, setDados] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Carregar os experimentos
    const fetchExperimentos = async () => {
      try {
        const experimentosResponse = await experimentoService.fetchExperimentos();
        setExperimentos(experimentosResponse.data);
      } catch (error) {
        console.error("Erro ao carregar experimentos:", error);
      }
    };

    fetchExperimentos();
  }, []); // Carregar apenas uma vez quando o componente é montado



  useEffect(() => {
    const carregarDados = async () => {
      try {


        const tiposSensoresResponse = await sensorService.fetchSensores();
        setTiposSensores(tiposSensoresResponse.data); // Acessa apenas os dados da resposta

        const placasResponse = await placaService.getPlacas();
        setPlacas(placasResponse.data); // Acessa apenas os dados da resposta
        const mqttResponse = await mqttService.fetchMqtt();
        const mqttDoUsuario = mqttResponse.data.find(mqtt => mqtt.usuario === user?.id);
        console.log(mqttDoUsuario.placa)
        if (mqttDoUsuario) {
          const placaDetailsResponse = await placaService.fetchPlacaDetails(mqttDoUsuario.placa);
          const dados = placaDetailsResponse.data;
          // Preparando os dados para o formulário
          const dadosFormulario = {
            placa: dados.placa.modelo,
            experimento: dados.sensores[0]?.experimento,
            pino_gpio: dados.sensores.pino_gpio,
            tipo_sensor: dados.sensores.tipo_sensor,
          };

          // Se você tiver um campo de sensores e quiser usar o primeiro sensor como padrão
          if (dados.sensores && dados.sensores.length > 0) {
            dadosFormulario.tipo_sensor = dados.sensores[0].tipo_sensor;
            dadosFormulario.pino_gpio = dados.sensores[0].pino_gpio;
            // dadosFormulario.experimento = dados.sensores[0].experimento;
          }
          // Usando a função reset para preencher os campos
          reset(dadosFormulario);

        }
      } catch (error) {
        console.error("Erro ao carregar dados da API", error);
      }
    };

    carregarDados();
  }, [reset, user?.id]);


  console.log(experimentos)


  // console.log(mqttDoUsuario?.placa)

  // useEffect(async () => {

  // }, [mqttDoUsuario]);

  console.log({ Dados })




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
          experimento: data?.experimento,
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
                  {experimentos.map((exp: any, index: number) => (
                    <MenuItem key={index} value={exp.id}>{exp.tipo_experimento}</MenuItem> // Valor ajustado para nome do experimento
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
