// src/features/auth/hooks/useLogin.ts
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido, Davi!'),
  password: z.string().min(1, 'A senha é obrigatória para entrar'),
});

export type LoginData = z.infer<typeof loginSchema>;

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmitForm = async (data: LoginData) => {
    try {
      await login(data);
      navigate('/dashboard'); 
    } catch (error) {
      console.error("❌ Erro ao logar:", error);
      alert("Ops! E-mail ou senha incorretos.");
    }
  };

  return { register, handleSubmit, onSubmitForm, errors };
}