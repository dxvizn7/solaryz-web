import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/solaryz', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Busca o token gerado dinamicamente do localStorage
  const token = localStorage.getItem('@SolaryZ:token'); 

  // Se ele existir (ou seja, se o usuário estiver logado), anexa na requisição
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});