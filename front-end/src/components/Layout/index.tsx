// components/Layout.tsx
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Box, Toolbar, AppBar, Typography, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Ícone para o menu suspenso
import LogoutIcon from '@mui/icons-material/Logout'; // Ícone de logout
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '../Sidebar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Função para lidar com a abertura do menu
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Função para lidar com o fechamento do menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
    handleClose();
  };

  const noLayoutRoutes = ['/usuario/login', '/usuario/cadastro'];
  const showLayout = !noLayoutRoutes.includes(router.pathname);

  console.log("Usuário logado:", user);

  return (
    <Box sx={{ display: 'flex' }}>
      {showLayout && (
        <>
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                IoT
              </Typography>
              <div>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {user && user.username ? (

                    <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                  ) : (
                    <MoreVertIcon />
                  )}

                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon /> Logout
                  </MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
          <Sidebar />
        </>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ...(showLayout ? { mt: 2 } : {}) }}>
        {showLayout && <Toolbar />} {/* Espaçador para o conteúdo principal não ficar atrás do AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
