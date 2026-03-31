import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useLogin } from '../../hooks/useLogin';
import LogoIconeBorda from '../../../../assets/logo-borda-s.svg';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const { register, handleSubmit, onSubmitForm, errors } = useLogin();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  // 1. Criamos o estado de controle do loading
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      // 2. Inicia o loading assim que o Google devolver o token
      setIsGoogleLoading(true); 
      
      try {
        await loginWithGoogle(response.credential);
        navigate('/dashboard');
      } catch (error) {
        console.error("Erro no login com Google:", error);
        alert("Ops! Não foi possível entrar com o Google.");
      } finally {
        // 3. Finaliza o loading em caso de erro (se der sucesso ele já vai pro dashboard)
        setIsGoogleLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-solar-dark flex items-center justify-center p-4 relative">
      
      {/* 4. OVERLAY DE LOADING */}
      {isGoogleLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all duration-300">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#F2910A] rounded-full animate-spin mb-4"></div>
          <p className="text-white font-medium">Autenticando, aguarde...</p>
        </div>
      )}

      <div className="max-w-md w-full bg-solar-dark rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* CABEÇALHO */}
        <div className="bg-[#2C2D34] p-8 text-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F2910A] rounded-full blur-3xl opacity-20"></div>
          <img 
            src={LogoIconeBorda} 
            alt="SolaryZ" 
            className="mx-auto block mb-4 w-30 h-25 transition-all duration-300 group-hover:hidden" 
          />
          <h2 className="text-2xl font-bold text-white mb-1">Bem-vindo ao SolaryZ</h2>
          <p className="text-gray-400 text-sm">Acesse sua conta para continuar</p>
        </div>

        {/* FORMULÁRIO */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-5">
            
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-solar-orange mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F2910A] outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
            </div>

            {/* SENHA */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-solar-orange">Senha</label>
                <a href="#" className="text-xs text-[#F2910A] hover:text-[#E94822] font-medium">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F2910A] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
            </div>

            {/* BOTAO ENTRAR */}
            <button 
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#E94822] to-[#F2910A] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#F2910A]/30"
            >
              Entrar <ArrowRight size={18} />
            </button>

            {/* SEPARADOR E LOGIN COM GOOGLE */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-solar-dark text-gray-400">Ou continue com</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login com Google falhou')}
                theme="filled_black"
                shape="pill"
                text="continue_with"
              />
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-white">
            Ainda não tem uma conta?{' '}
            <a href="/register" className="font-bold text-[#F2910A] hover:text-[#E94822]">Criar conta</a>
          </p>
        </div>
      </div>
    </div>
  );
}