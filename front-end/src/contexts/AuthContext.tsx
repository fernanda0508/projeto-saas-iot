// context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, getUserProfile } from '@/services/api'; // Adicione uma função para buscar o perfil do usuário
import Router from 'next/router';

interface User {
  username: string; // Defina aqui os campos do seu objeto de usuário

}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Carrega o token armazenado e define o usuário se estiver autenticado
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile(); // Buscar informações do usuário
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await getUserProfile(); // Implemente esta função para buscar o perfil do usuário
      setUser(userProfile);
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário', error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const data = await authService.login(username, password);
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setIsAuthenticated(true);
      await fetchUserProfile(); // Buscar informações do usuário após o login bem-sucedido
      Router.push('/'); // Redireciona para a página inicial após o login
    } catch (error) {
      console.error('Erro no login', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    Router.push('/usuario/login'); // Redireciona para a página de login
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
