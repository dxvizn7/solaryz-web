import { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useLogin } from '../../hooks/useLogin';
import LogoIconeBorda from '../../../../assets/logo-borda-s.svg';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StarBackground } from '../../../../components/StarsComponent';
import { useNotification } from '../../../../contexts/NotificationContext';

export function LoginForm() {
  const { register, handleSubmit, onSubmitForm, errors } = useLogin();
  const { loginWithGoogle } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      setIsGoogleLoading(true);
      try {
        await loginWithGoogle(response.credential);
        addNotification({
          type: 'success',
          message: 'Huston, estamos dentro! Login realizado com sucesso.'
        });
        navigate('/dashboard');
      } catch (error) {
        console.error("Erro no login com Google:", error);
        addNotification({
          type: 'error',
          message: 'Não foi possível estabelecer conexão com o Google.'
        });
      } finally {
        setIsGoogleLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">

      <StarBackground starCount={60} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E94822]/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <AnimatePresence>
        {isGoogleLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-[#050507]/80 backdrop-blur-md flex flex-col items-center justify-center z-50 text-center px-4"
          >
            <Loader2 className="w-12 h-12 text-[#E94822] animate-spin mb-4" />
            <p className="text-gray-300 font-medium tracking-wide">Sincronizando coordenadas...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-[#0A0A0C]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(233,72,34,0.05)] overflow-hidden relative z-10"
      >
        <div className="p-8 pb-4 text-center relative">
          <img
            src={LogoIconeBorda}
            alt="SolaryZ"
            className="mx-auto block mb-6 w-16 h-16 drop-shadow-[0_0_15px_rgba(233,72,34,0.4)]"
          />
          <h2 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Bem-vindo de volta
          </h2>
          <p className="text-gray-400 text-sm italic">"Iluminando o caminho para sua liberdade financeira"</p>
        </div>

        <div className="p-8 pt-4">
          <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500 group-focus-within:text-[#E94822] transition-colors" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:bg-white/10 focus:border-[#E94822] focus:ring-1 focus:ring-[#E94822] outline-none transition-all"
                  placeholder="astronauta@solaryz.com"
                />
              </div>
              {errors.email && <span className="text-red-400 text-[10px] mt-1.5 ml-1 block uppercase font-bold tracking-wider">{errors.email.message}</span>}
            </div>

            {/* SENHA */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-300">Senha</label>
                <Link to="/esqueci-senha" className="text-xs text-[#F2910A] hover:text-[#E94822] transition-colors font-semibold">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500 group-focus-within:text-[#E94822] transition-colors" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:bg-white/10 focus:border-[#E94822] focus:ring-1 focus:ring-[#E94822] outline-none transition-all"
                  placeholder="Sua senha secreta"
                />
              </div>
              {errors.password && <span className="text-red-400 text-[10px] mt-1.5 ml-1 block uppercase font-bold tracking-wider">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#E94822] to-[#F2910A] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(233,72,34,0.3)] hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Iniciar Missão <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[#0A0A0C] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => addNotification({ type: 'error', message: 'Huston, temos um problema com o Google.' })}
                theme="filled_black"
                shape="pill"
                text="continue_with"
                size="large"
              />
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Ainda não está em órbita?{' '}
            <Link to="/register" className="font-bold text-white hover:text-[#F2910A] transition-colors">
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}