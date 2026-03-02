import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../../../config/api';
import type { LoginData } from '../hooks/useLogin';

interface AuthContextData {
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. O estado inicial agora checa o localStorage primeiro
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('@SolariZ:token');
    return !!token; // Se tem token, começa como true. Se não, false.
  });

  const login = async (data: LoginData) => {
    // 1. Faz a requisição pro backend
    const response = await api.post('/login', data);

    console.log("RESPOSTA DA API:", response.data);
    
    // 2. Extrai o token da resposta (ajuste de acordo com o retorno do seu Laravel)
    const token = response.data.access_token; 

    if (token) {
      // 3. Salva no cofre do navegador
      localStorage.setItem('@SolaryZ:token', token);
      
      // 4. Muda o estado pra liberar as rotas privadas
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    // 6. Limpa tudo na hora de sair
    localStorage.removeItem('@SolaryZ:token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);