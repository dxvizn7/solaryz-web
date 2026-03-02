// src/features/auth/contexts/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../../../config/api';
import type { LoginData } from '../hooks/useLogin';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null; // 2. Adicionamos o usuário no contexto
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado do Token
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('@SolaryZ:token');
    return !!token;
  });

  // 3. Estado do Usuário: já tenta buscar do localStorage quando carrega
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@SolaryZ:user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const login = async (data: LoginData) => {
    const response = await api.post('/login', data);
    
    const token = response.data.access_token;
    const userData = response.data.user; // 4. Pegamos o objeto user que a API devolve

    if (token && userData) {
      // Salva o token
      localStorage.setItem('@SolaryZ:token', token);
      setIsAuthenticated(true);

      // Salva os dados do usuário convertendo para texto (JSON.stringify)
      localStorage.setItem('@SolaryZ:user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    // Limpa tudo na hora de sair
    localStorage.removeItem('@SolaryZ:token');
    localStorage.removeItem('@SolaryZ:user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);