import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useLogin } from '../../hooks/useLogin';
import LogoIconeBorda from '../../../../assets/logo-borda-s.svg'

export function LoginForm() {
  const { register, handleSubmit, onSubmitForm, errors } = useLogin();

  return (
    <div className="min-h-screen bg-solar-dark flex items-center justify-center p-4">
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
                  {...register('email')} /* 🔌 PLUGADO */
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
                  {...register('password')} /* 🔌 PLUGADO */
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F2910A] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
            </div>

            {/* type="submit" PARA DISPARAR A FUNÇÃO */}
            <button 
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#E94822] to-[#F2910A] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#F2910A]/30"
            >
              Entrar <ArrowRight size={18} />
            </button>
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