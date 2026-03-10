import { useState } from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { useAccounts } from '../../../accounts/hooks/useAccounts';
import { useInvestments } from '../../../investments/hooks/useInvestments';
import { useTransactionSummary } from '../../../transactions/hooks/useTransactionSummary';
import { AccountList } from '../../../accounts/components/AccountList';
import { InvestmentList } from '../../../investments/components/InvestmentList';
import { CategoryExpenseList } from '../../../categories/components/CategoryExpenseList';

type ActiveView = 'balance' | 'investments';

export function BalanceSummary() {
  const [activeView, setActiveView] = useState<ActiveView>('balance');
  const [hidden, setHidden] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const { accounts, totalBalance } = useAccounts();
  const { investments, totalInvested, isLoading: isLoadingInvestments } = useInvestments();
  const { summary } = useTransactionSummary();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const isBalance = activeView === 'balance';

  return (
    <div className="flex flex-col gap-6 mt-6 w-full">
      {/* Toggle */}
      <div className="flex gap-2">
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

      {/* Layout principal: card + categorias lado a lado */}
      <div className="flex gap-6 items-start w-full">

        {/* Coluna esquerda */}
        <div className="flex flex-col gap-4 min-w-[320px] max-w-[380px]">

          {/* Card principal */}
          {isBalance ? (
            <div className="relative rounded-2xl overflow-hidden w-full">
              <div className="bg-gradient-to-br from-[#F2A416] to-[#E85D04] p-6 relative">
                <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10" />
                <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-white/10" />

                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-white/80 text-sm font-medium">Saldo Total</span>
                  <button
                    onClick={() => setHidden(!hidden)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative z-10 mb-4">
                  <span className="text-white text-4xl font-bold tracking-tight">
                    {hidden ? 'R$ ••••••' : formatCurrency(totalBalance)}
                  </span>
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
                    <div className="bg-white/20 p-1 rounded-full">
                      <TrendingUp size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Entradas</p>
                      <p className="text-white text-sm font-semibold">
                        {hidden ? '••••' : formatCurrency(summary.income)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
                    <div className="bg-white/20 p-1 rounded-full">
                      <TrendingDown size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Saídas</p>
                      <p className="text-white text-sm font-semibold">
                        {hidden ? '••••' : formatCurrency(summary.expense)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden w-full">
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 relative">
                <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full bg-solar-orange/10" />
                <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-solar-orange/10" />

                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-white/60 text-sm font-medium">Total Investido</span>
                  <button
                    onClick={() => setHidden(!hidden)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative z-10 mb-4">
                  {isLoadingInvestments ? (
                    <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
                  ) : (
                    <span className="text-white text-4xl font-bold tracking-tight">
                      {hidden ? 'R$ ••••••' : formatCurrency(totalInvested)}
                    </span>
                  )}
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                    <div className="bg-solar-orange/30 p-1 rounded-full">
                      <TrendingUp size={12} className="text-solar-orange" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Ativos</p>
                      <p className="text-white text-sm font-semibold">{investments.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão mostrar/ocultar contas */}
          <button
            onClick={() => setShowAccounts(!showAccounts)}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white/80 text-sm font-medium"
          >
            <span>{isBalance ? 'Minhas Contas' : 'Meus Investimentos'}</span>
            {showAccounts
              ? <ChevronUp size={15} />
              : <ChevronDown size={15} />
            }
          </button>

          {/* Lista colapsável */}
          {showAccounts && (
            <section>
              {isBalance
                ? <AccountList accounts={accounts} />
                : <InvestmentList investments={investments} />
              }
            </section>
          )}
        </div>

        {/* Coluna direita — gastos por categoria */}
        <div className="flex-1 min-w-0">
          <CategoryExpenseList />
        </div>

      </div>
    </div>
  );
}