import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-solar-orange transition-colors">
          <Bell size={20} />
        </button>
        {/* Avatar do Usuário */}
        <div className="w-10 h-10 rounded-full bg-solar-yellow/20 flex items-center justify-center text-solar-orange font-bold border border-solar-yellow/30">
          D
        </div>
      </div>
    </header>
  );
}