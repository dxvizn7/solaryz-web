import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useRegister } from '../../hooks/useRegister';

export function RegisterForm() {
  const { register, handleSubmit, onSubmitForm, errors } = useRegister();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-[#2C2D34] p-8 text-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F2910A] rounded-full blur-3xl opacity-20"></div>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#E94822] via-[#F2910A] to-[#EFD510] flex items-center justify-center font-bold text-[#2C2D34] text-2xl shadow-lg mb-4">
            S
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Crie sua conta</h2>
          <p className="text-gray-400 text-sm">Junte-se ao SolaryZ hoje mesmo</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
            
            {/* CAMPO NOME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  {...register('name')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F2910A] outline-none transition-all"
                  placeholder="Davi Mendo Soccol"
                />
              </div>
              {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
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

            <button 
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#E94822] to-[#F2910A] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#F2910A]/30"
            >
              Criar Conta <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <a href="/login" className="font-bold text-[#F2910A] hover:text-[#E94822]">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  );
}