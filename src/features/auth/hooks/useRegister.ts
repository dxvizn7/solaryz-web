import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../../config/api';
import { useNavigate } from 'react-router-dom';

// 1. O ZOD DITA AS REGRAS (Agora sem o confirmPassword)
const registerSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 letras'),
  email: z.string().email('Digite um e-mail válido, Davi!'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

// 2. A TIPAGEM AUTOMÁTICA
export type RegisterData = z.infer<typeof registerSchema>;

// 3. O SEU HOOK (O Motor)
export function useRegister() {
  const navigate = useNavigate();
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  // 4. A AÇÃO FINAL
  const onSubmitForm = (data: RegisterData) => {
    try {
      
      api.post('/register', data);

      navigate('/login');
    } catch (error) {
      console.error("❌ Erro ao registrar:", error);
      alert("Não foi possível criar a conta. Verifique os dados.");
    }
  };

  return { register, handleSubmit, onSubmitForm, errors };
}