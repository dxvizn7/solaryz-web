import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Check, ShieldCheck } from 'lucide-react';
import { useRegister } from '../../hooks/useRegister';
import LogoIconeBorda from '../../../../assets/logo-borda-s.svg';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StarBackground } from '../../../../components/StarsComponent';
import { useNotification } from '../../../../contexts/NotificationContext';

export function RegisterForm() {
  const { register, handleSubmit, onSubmitForm, errors, password } = useRegister();
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
          message: 'Bem-vindo ao Solaryz! Sua jornada começa agora.'
        });
        navigate('/dashboard');
      } catch (error) {
        console.error("Erro no registro com Google:", error);
        addNotification({
          type: 'error',
          message: 'Ops! Não foi possível preparar o seu lançamento com o Google.'
        });
      } finally {
        setIsGoogleLoading(false);
      }
    }
  };

  // Requisitos de força de senha
  const strengthRequirements = [
    { label: 'Mínimo de 8 caracteres', regex: /.{8,}/ },
    { label: 'Uma letra maiúscula', regex: /[A-Z]/ },
    { label: 'Um número', regex: /[0-9]/ },
    { label: 'Um caractere especial (@$!%*?&)', regex: /[^A-Za-z0-9]/ },
  ];

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">
      
      <StarBackground starCount={60} shootingStarCount={4} />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F2910A]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <AnimatePresence>
        {isGoogleLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-[#050507]/80 backdrop-blur-md flex flex-col items-center justify-center z-50 text-center px-4"
          >
            <Loader2 className="w-12 h-12 text-[#F2910A] animate-spin mb-4" />
            <p className="text-gray-300 font-medium tracking-wide">Calculando trajetória orbital...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-[#0A0A0C]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(242,145,10,0.05)] overflow-hidden relative z-10 my-8"
      >
        <div className="p-8 pb-4 text-center relative">
          <img 
            src={LogoIconeBorda} 
            alt="SolaryZ" 
            className="mx-auto block mb-6 w-16 h-16 drop-shadow-[0_0_15px_rgba(242,145,10,0.4)]" 
          />
          <h2 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Inicie sua Jornada
          </h2>
          <p className="text-gray-400 text-sm italic">"O universo das suas finanças em um só lugar"</p>
        </div>

        <div className="p-8 pt-4">
          <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
            
            {/* NOME COMPLETO */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500 group-focus-within:text-[#F2910A] transition-colors" />
                </div>
                <input 
                  type="text" 
                  {...register('name')}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:bg-white/10 focus:border-[#F2910A] focus:ring-1 focus:ring-[#F2910A] outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
              {errors.name && <span className="text-red-400 text-[10px] mt-1 ml-1 block uppercase font-bold tracking-wider">{errors.name.message}</span>}
            </div>

            {/* E-MAIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500 group-focus-within:text-[#F2910A] transition-colors" />
                </div>
                <input 
                  type="email" 
                  {...register('email')}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:bg-white/10 focus:border-[#F2910A] focus:ring-1 focus:ring-[#F2910A] outline-none transition-all"
                  placeholder="exemplo@solaryz.com"
                />
              </div>
              {errors.email && <span className="text-red-400 text-[10px] mt-1 ml-1 block uppercase font-bold tracking-wider">{errors.email.message}</span>}
            </div>

            {/* SENHA */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                Senha <ShieldCheck size={14} className="text-gray-500" />
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500 group-focus-within:text-[#F2910A] transition-colors" />
                </div>
                <input 
                  type="password" 
                  {...register('password')}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:bg-white/10 focus:border-[#F2910A] focus:ring-1 focus:ring-[#F2910A] outline-none transition-all"
                  placeholder="Crie uma senha forte"
                />
              </div>
              {errors.password && <span className="text-red-400 text-[10px] mt-1 ml-1 block uppercase font-bold tracking-wider">{errors.password.message}</span>}
              
              {/* INDICADOR DE FORÇA */}
              <div className="mt-3 bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Segurança da Senha</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {strengthRequirements.map((req, i) => {
                    const isMet = req.regex.test(password || '');
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${isMet ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                          <Check size={10} className={isMet ? 'text-emerald-400' : 'text-gray-600'} />
                        </div>
                        <span className={`text-[11px] transition-colors ${isMet ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CONFIRMAR SENHA */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Confirmar Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500 group-focus-within:text-[#E94822] transition-colors" />
                </div>
                <input 
                  type="password" 
                  {...register('confirm_password')}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:bg-white/10 focus:border-[#E94822] focus:ring-1 focus:ring-[#E94822] outline-none transition-all"
                  placeholder="Repita sua senha"
                />
              </div>
              {errors.confirm_password && (
                <span className="text-red-400 text-[10px] mt-1 ml-1 block uppercase font-bold tracking-wider">
                  {errors.confirm_password.message}
                </span>
              )}
            </div>

            <button 
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#F2910A] to-[#E94822] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(242,145,10,0.3)] hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Lançar Missão <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[#0A0A0C] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Conexão Rápida
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => addNotification({ type: 'error', message: 'Conexão com Google falhou' })}
                theme="filled_black"
                shape="pill"
                text="signup_with"
                size="large"
              />
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Já possui coordenadas?{' '}
            <Link to="/login" className="font-bold text-white hover:text-[#E94822] transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}