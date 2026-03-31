// src/features/auth/contexts/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../../../config/api';
import type { LoginData } from '../hooks/useLogin';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  has_connected_account: boolean;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('@SolaryZ:token');
    return !!token;
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@SolaryZ:user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const login = async (data: LoginData) => {
    const response = await api.post('login', data);
    
    const token = response.data.access_token;
    const userData = response.data.user; 

    if (token && userData) {
      localStorage.setItem('@SolaryZ:token', token);
      setIsAuthenticated(true);
      localStorage.setItem('@SolaryZ:user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const loginWithGoogle = async (googleToken: string) => {
    const response = await api.post('auth/google', { token: googleToken });
    
    const token = response.data.access_token;
    const userData = response.data.user; 

    if (token && userData) {
      localStorage.setItem('@SolaryZ:token', token);
      setIsAuthenticated(true);
      localStorage.setItem('@SolaryZ:user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('@SolaryZ:token');
    localStorage.removeItem('@SolaryZ:user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('@SolaryZ:user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);