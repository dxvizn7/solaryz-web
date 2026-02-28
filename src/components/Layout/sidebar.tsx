import { Home, ArrowRightLeft, Target, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-20 hover:w-64 transition-all duration-300 ease-in-out bg-[#2C2D34] min-h-screen flex flex-col text-white group overflow-hidden shrink-0 shadow-2xl relative z-50">
      
      {/* Logo SolariZ */}
      <div className="p-5 flex items-center gap-4">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-[#E94822] via-[#F2910A] to-[#EFD510] flex items-center justify-center font-bold text-[#2C2D34] shadow-lg">
          S
        </div>
        <span className="text-xl font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          SolariZ
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 flex flex-col gap-2 mt-6">
        {/* Item Ativo */}
        <a href="#" className="flex items-center gap-4 px-3 py-3 bg-[#F2910A]/10 text-[#F2910A] rounded-xl transition-colors overflow-hidden shrink-0">
          <Home size={24} className="shrink-0" />
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Dashboard
          </span>
        </a>
        
        {/* Itens Inativos */}
        <a href="#" className="flex items-center gap-4 px-3 py-3 text-gray-400rounded-xl transition-colors overflow-hidden shrink-0 hover:text-solar-orange">
          <ArrowRightLeft size={24} className="shrink-0" />
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Transações
          </span>
        </a>
        <a href="#" className="flex items-center gap-4 px-3 py-3 text-gray-400 rounded-xl transition-colors overflow-hidden shrink-0 hover:text-solar-orange">
          <Target size={24} className="shrink-0" />
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Metas
          </span>
        </a>
      </nav>

      {/* Footer da Sidebar */}
      <div className="p-3 mb-4">
        <a href="#" className="flex items-center gap-4 px-3 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors overflow-hidden shrink-0">
          <Settings size={24} className="shrink-0" />
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Configurações
          </span>
        </a>
      </div>
    </aside>
  );
}