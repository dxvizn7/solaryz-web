import { Home, ArrowRightLeft, Target, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-solar-dark min-h-screen flex flex-col text-white">
      {/* Logo SolariZ */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-solar-red via-solar-orange to-solar-yellow flex items-center justify-center font-bold text-solar-dark shadow-lg shadow-solar-orange/20">
          S
        </div>
        <span className="text-xl font-bold tracking-wider">SolaryZ</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
        {/* Item Ativo (Laranja) */}
        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-solar-orange/10 text-solar-orange rounded-xl transition-colors">
          <Home size={20} />
          <span className="font-medium">Dashboard</span>
        </a>
        
        {/* Item Inativo (Cinza) */}
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <ArrowRightLeft size={20} />
          <span className="font-medium">Transações</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <Target size={20} />
          <span className="font-medium">Metas</span>
        </a>
      </nav>

      {/* Footer da Sidebar */}
      <div className="p-4">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <Settings size={20} />
          <span className="font-medium">Configurações</span>
        </a>
      </div>
    </aside>
  );
}