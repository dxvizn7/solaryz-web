import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/solaryz', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = "4|kfNsILM4XtuoYbXO8sZmjPERPPJkE4o2suaqcJ6I6c816fa0"; 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});