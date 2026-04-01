// src/features/auth/hooks/useLogin.ts
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido!'),
  password: z.string().min(1, 'A senha é obrigatória para entrar'),
});

export type LoginData = z.infer<typeof loginSchema>;

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmitForm = async (data: LoginData) => {
    try {
      await login(data);
      addNotification({
        type: 'success',
        message: 'Conexão estabelecida! Bem-vindo de volta.'
      });
      navigate('/dashboard'); 
    } catch (error) {
      console.error("❌ Erro ao logar:", error);
      addNotification({
        type: 'error',
        message: 'Ops! E-mail ou senha incorretos. Verifique suas credenciais.'
      });
    }
  };

  return { register, handleSubmit, onSubmitForm, errors };
}