// context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, getUserProfile } from '@/services/api';
import Router from 'next/router';
import axios from "axios";

interface User {
  id: number,
  username: string // Adicione outros campos conforme necessário
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setAxiosAuthToken = (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAxiosAuthToken(token);
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário', error);
      logout(); // Limpar o estado de autenticação se ocorrer um erro
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const data = await authService.login(username, password);
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setAxiosAuthToken(data.access);
      await fetchUserProfile();
      Router.push('/');
    } catch (error) {
      console.error('Erro no login', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    Router.push('/usuario/login');
  };

  if (loading) {
    return <div>Carregando...</div>; // Ou algum componente de carregamento
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
