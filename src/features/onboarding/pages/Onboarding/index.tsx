import { Building2, ShieldCheck, LayoutDashboard, Lock } from 'lucide-react';
import { PluggyConnectButton } from '../../../accounts/components/PluggyConnect';
import LogoIconeBorda from '../../../../assets/logo-borda-s.svg'


export function Onboarding() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Ícone Central / Logo com fundo branco para contraste */}
      <div className="relative mb-6 mt-10">
        <div>
          {/* Aqui você coloca o src da sua logo real */}
          <img 
          src={LogoIconeBorda} 
          alt="SolaryZ" 
          className="w-20 h-20 transition-all duration-300 group-hover:hidden block" 
        />
        </div>
      </div>

      {/* Textos de Boas-vindas */}
      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        Bem-vindo ao <span className="text-solar-orange">SolaryZ</span>
      </h1>
      <p className="text-gray-500 max-w-md text-center mb-16">
        Conecte sua conta bancária para começar a gerenciar suas finanças de forma inteligente e visual.
      </p>

      {/* Grid com os 3 Passos */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 max-w-4xl w-full justify-center">
        
        {/* Card 1: Escolha seu banco */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-sm relative w-full md:w-1/3 pt-10">
          <div className="absolute -top-4 bg-solar-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md">1</div>
          <div className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-400">
            <Building2 className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Escolha seu banco</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Conecte-se com mais de 200 instituições financeiras de forma segura.</p>
        </div>

        {/* Card 2: Autorize a conexão */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-sm relative w-full md:w-1/3 pt-10">
          <div className="absolute -top-4 bg-solar-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md">2</div>
          <div className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-400">
            <ShieldCheck className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Autorize a conexão</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Seus dados são protegidos com criptografia de ponta a ponta.</p>
        </div>

        {/* Card 3: Pronto para usar */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-sm relative w-full md:w-1/3 pt-10">
          <div className="absolute -top-4 bg-solar-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md">3</div>
          <div className="bg-gray-50 p-4 rounded-xl mb-4 text-gray-400">
            <LayoutDashboard className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Pronto para usar</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Visualize saldos, transações e metas em tempo real.</p>
        </div>

      </div>

      {/* Botão da Pluggy */}
      <PluggyConnectButton />

      {/* Footer de Segurança */}
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-gray-400">
        <Lock className="w-4 h-4" strokeWidth={2} />
        <span>Conexão segura e criptografada</span>
      </div>
      
    </div>
  );
}