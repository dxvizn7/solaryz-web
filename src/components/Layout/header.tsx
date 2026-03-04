import { Bell } from 'lucide-react';
import { useAuth } from '../../features/auth/contexts/AuthContext';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth();

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <header className="h-20 bg-solar-dark border-b border-white/5 flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-solar-orange to-solar-yellow bg-clip-text text-transparent">
        {title}
      </h1>
      
      <div className="flex items-center gap-6">
        <button className="p-2 text-gray-400 hover:text-solar-orange transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-300 font-medium">
            Olá, <strong className="text-white">{firstName}</strong>!
          </span>

          <div className="w-10 h-10 rounded-full bg-solar-yellow/20 flex items-center justify-center text-solar-orange font-bold border border-solar-yellow/30">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}