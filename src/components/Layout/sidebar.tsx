import { Home, ArrowRightLeft, Target, Settings, Tag, Wallet, BarChart2, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LogoIconeBorda from '../../assets/logo-borda-s.svg';
import LetreiroSolaryz from '../../assets/letreiro-solaryz.svg';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/transactions', label: 'Transações', icon: ArrowRightLeft },
  { to: '/goals', label: 'Metas', icon: Target },
];

const managementItems = [
  { to: '/credit-cards', label: 'Cartões', icon: CreditCard },
  { to: '/categories', label: 'Categorias', icon: Tag },
  { to: '/accounts', label: 'Contas', icon: Wallet },
  { to: '/investments', label: 'Investimentos', icon: BarChart2 },
];

export function Sidebar() {
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  function navClass(path: string) {
    return `flex items-center gap-4 px-3 py-3 rounded-xl transition-colors overflow-hidden shrink-0 ${
      isActive(path)
        ? 'bg-[#F2910A]/10 text-[#F2910A]'
        : 'text-gray-400 hover:bg-white/5 hover:text-solar-orange'
    }`;
  }

  return (
    <aside className="w-20 hover:w-64 transition-all duration-300 ease-in-out bg-[#2C2D34] min-h-screen flex flex-col text-white group overflow-hidden shrink-0 shadow-2xl relative z-50">
      <div className="flex items-center justify-center h-20 w-full relative px-4">
        <img
          src={LogoIconeBorda}
          alt="SolaryZ"
          className="w-10 h-10 transition-all duration-300 group-hover:hidden block"
        />
        <img
          src={LetreiroSolaryz}
          alt="SolaryZ"
          className="h-9 max-w-none transition-all duration-300 hidden group-hover:block"
        />
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 px-3 flex flex-col gap-1 mt-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={navClass(to)}>
            <Icon size={24} className="shrink-0" />
            <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {label}
            </span>
          </Link>
        ))}

        {/* Separador Gestão */}
        <div className="mt-4 mb-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white/20 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">
            Gestão
          </span>
        </div>

        {managementItems.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={navClass(to)}>
            <Icon size={24} className="shrink-0" />
            <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 mb-4">
        <Link to="/settings" className={navClass('/settings')}>
          <Settings size={24} className="shrink-0" />
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Configurações
          </span>
        </Link>
      </div>
    </aside>
  );
}