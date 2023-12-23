// components/LogoutButton.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@mui/material/Button';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Button sx={{ backgroundColor: "white", color: "black", display: "flex", justifyContent: "end" }} variant="contained" onClick={logout}>
      Sair
    </Button>
  );
};

export default LogoutButton;
