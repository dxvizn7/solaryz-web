import { TrendingUp } from 'lucide-react';
import { useInvestments } from '../../hooks/useInvestments';

export function InvestmentSummary() {
  const { totalInvested, isLoading } = useInvestments();

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalInvested);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4 w-full">
      <div className="bg-gray-50 p-3 rounded-xl text-solar-orange">
        <TrendingUp size={22} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-400 font-medium">Total Investido</span>
        {isLoading ? (
          <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mt-1" />
        ) : (
          <span className="text-xl font-bold text-gray-800">{formatted}</span>
        )}
        <span className="text-xs text-gray-400 mt-0.5">Atualizado agora mesmo</span>
      </div>
    </div>
  );
}