import { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from '@/contexts/AuthContext';


// Defina o tema aqui
const theme = createTheme({
  palette: {
    primary: {
      main: '#0672A0', // Substitua pela cor desejada, ex: '#009688'
    },
    // Outras configurações do tema, se necessário
  },
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider> {/* Adiciona o AuthProvider aqui */}
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalize CSS e aplica o tema corretamente */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </AuthProvider>

  );
}

export default MyApp;


