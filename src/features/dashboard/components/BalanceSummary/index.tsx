import { useState } from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { useSummary } from '../../hooks/useSummary';
import { useInvestments } from '../../../investments/hooks/useInvestments';
import { AccountList } from '../../../accounts/components/AccountList';

type ActiveView = 'balance' | 'investments';

export function BalanceSummary() {
  const [activeView, setActiveView] = useState<ActiveView>('balance');
  const { totalBalance } = useSummary();
  const { totalInvested, isLoading: isLoadingInvestments } = useInvestments();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const isBalance = activeView === 'balance';

  return (
    <div className="flex flex-col gap-10 mt-6 items-left">
      <section>
        {/* Toggle buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveView('balance')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              isBalance
                ? 'bg-solar-orange text-white shadow-md'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <Wallet size={14} />
            Saldo
          </button>
          <button
            onClick={() => setActiveView('investments')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              !isBalance
                ? 'bg-solar-orange text-white shadow-md'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <TrendingUp size={14} />
            Investimentos
          </button>
        </div>

        {/* Card animado */}
        <div
          className={`rounded-2xl p-6 shadow-sm flex items-center gap-4 w-full transition-all duration-300 ${
            isBalance
              ? 'bg-gradient-to-br from-yellow-400 to-solar-orange text-white'
              : 'bg-white text-gray-800'
          }`}
        >
          {/* Ícone */}
          <div
            className={`p-3 rounded-xl transition-all duration-300 ${
              isBalance ? 'bg-white/20 text-white' : 'bg-gray-50 text-solar-orange'
            }`}
          >
            {isBalance ? (
              <Wallet size={22} strokeWidth={1.5} />
            ) : (
              <TrendingUp size={22} strokeWidth={1.5} />
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                isBalance ? 'text-white/80' : 'text-gray-400'
              }`}
            >
              {isBalance ? 'Saldo Total' : 'Total Investido'}
            </span>

            {!isBalance && isLoadingInvestments ? (
              <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-2xl font-bold transition-all duration-300">
                {isBalance ? formatCurrency(totalBalance) : formatCurrency(totalInvested)}
              </span>
            )}

            <span
              className={`text-xs mt-0.5 transition-colors duration-300 ${
                isBalance ? 'text-white/70' : 'text-gray-400'
              }`}
            >
              Atualizado agora mesmo
            </span>
          </div>
        </div>
      </section>

      <section>
        <AccountList />
      </section>
    </div>
  );
}