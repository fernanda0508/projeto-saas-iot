// components/Sidebar.tsx
import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import SensorIcon from '@mui/icons-material/Sensors'; // Importe ícones apropriados
import SettingsIcon from '@mui/icons-material/Settings';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import { Box } from '@mui/system';
import { Toolbar } from '@mui/material';


const drawerWidth = 240;

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
  },
  '&.Mui-selected:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState('');
  const [open, setOpen] = useState(true);

  const handleListItemClick = (path: string) => {
    setSelectedPath(path);
    router.push(path);
  };

  const handleToggle = () => {
    setOpen(!open);
  };
  const drawerItems = [
    {
      text: 'Configurar Sensor',
      icon: <SensorIcon />,
      href: '/configuracoes/sensor',
    },
    {
      text: 'Configurações da Placa',
      icon: <SettingsIcon />,
      href: '/settings',
    },
    {
      text: 'Conexão e Protocolos',
      icon: <LinkIcon />,
      href: '/connection',
    },
    {
      text: 'Programação e Automação',
      icon: <CodeIcon />,
      href: '/automation',
    },
    // Adicione mais itens aqui conforme necessário
  ]

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme => theme.palette.primary.main, // Isso aplica a cor de fundo

          },
        }}
      >
        <Toolbar /> {/* Espaçador para alinhar com o AppBar */}
        <List >
          {drawerItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={selectedPath === item.href}
              onClick={() => handleListItemClick(item.href)}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: 'white', fontWeight: "bold" }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
