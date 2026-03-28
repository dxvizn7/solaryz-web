import { Bell, LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../features/auth/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-solar-dark border-b border-white/5 flex items-center justify-between px-8 z-10">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-solar-orange to-solar-yellow bg-clip-text text-transparent">
        {title}
      </h1>
      
      <div className="flex items-center gap-6">
        <button className="p-2 text-gray-400 hover:text-solar-orange transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg transition-all group"
          >
            <span className="text-gray-300 font-medium hidden sm:block">
              Olá, <strong className="text-white">{firstName}</strong>!
            </span>

            <div className="relative">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full border border-solar-yellow/30 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-solar-yellow/20 flex items-center justify-center text-solar-orange font-bold border border-solar-yellow/30">
                  {initial}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-solar-dark rounded-full p-0.5 border border-white/10 text-gray-400 group-hover:text-solar-orange transition-colors">
                <ChevronDown size={12} />
              </div>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-solar-dark border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-white/5 mb-1">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>

              <Link 
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <UserIcon size={18} className="text-solar-orange" />
                Editar perfil
              </Link>

              <Link 
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Settings size={18} />
                Configurações
              </Link>

              <div className="border-t border-white/5 mt-1 pt-1">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <LogOut size={18} />
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}