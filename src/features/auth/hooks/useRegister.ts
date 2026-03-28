import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../../config/api';
import { useNavigate } from 'react-router-dom';

// 1. Zod alinhado com o Laravel (mínimo de 8 caracteres)
const registerSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 letras'),
  email: z.string().email('Digite um e-mail válido, Davi!'),
  password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres'), // Correção aqui!
});

export type RegisterData = z.infer<typeof registerSchema>;

export function useRegister() {
  const navigate = useNavigate();
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  // 2. Transformando a função em assíncrona (async/await)
  const onSubmitForm = async (data: RegisterData) => {
    try {
      // Agora o React espera a resposta do Laravel antes de navegar
      await api.post('register', data); 
      
      alert("Conta criada com sucesso!");
      navigate('/login');
    } catch (error: any) {
      console.error("❌ Erro ao registrar:", error);
      
      // Capturando a mensagem exata de erro que o Laravel enviou (o 422)
      const backendMessage = error.response?.data?.message || "Não foi possível criar a conta.";
      alert(`Ops: ${backendMessage}`);
    }
  };

  return { register, handleSubmit, onSubmitForm, errors };
}