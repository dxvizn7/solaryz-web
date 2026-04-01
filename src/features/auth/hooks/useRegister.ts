import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../../config/api';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../contexts/NotificationContext';

// 1. Zod alinhado com o Laravel e com confirmação de senha
const registerSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 letras'),
  email: z.string().email('Digite um e-mail válido, Davi!'),
  password: z.string()
    .min(8, 'A senha precisa ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Pelo menos um caractere especial'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"],
});

export type RegisterData = z.infer<typeof registerSchema>;

export function useRegister() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { 
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  const password = watch('password', '');

  const onSubmitForm = async (data: RegisterData) => {
    try {
      await api.post('register', data); 
      
      addNotification({
        type: 'success',
        message: 'Missão iniciada! Sua conta foi criada com sucesso.'
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error("❌ Erro ao registrar:", error);
      
      const backendMessage = error.response?.data?.message || "Não foi possível preparar o lançamento da sua conta.";
      
      addNotification({
        type: 'error',
        message: backendMessage
      });
    }
  };

  return { register, handleSubmit, onSubmitForm, errors, password };
}