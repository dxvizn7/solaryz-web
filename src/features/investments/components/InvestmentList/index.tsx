import { TrendingUp } from 'lucide-react';
import type { Investment } from '../../services/investmentsService';

interface Props {
  investments: Investment[];
  isHidden?: boolean;
}

export function InvestmentList({ investments, isHidden = false }: Props) {
  const previewInvestments = investments.slice(0, 4);
  const hasMore = investments.length > 4;

  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-5 w-full mt-6 border border-white/5">
      <h2 className="text-white/80 text-sm font-medium mb-4">Meus Investimentos</h2>

      <div className="flex flex-col">
        {previewInvestments.map((investment) => {
          const formattedBalance = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(Number(investment.balance));

          const balanceDisplay = isHidden ? 'R$ ••••••' : formattedBalance;

          return (
            <div 
              key={investment.id} 
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 p-2 text-solar-orange">
                  <TrendingUp size={20} />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-white/90 text-sm font-semibold">
                    {investment.name}
                  </span>
                  
                  <span className="text-white/40 text-xs flex flex-col">
                    <span>
                      {investment.type ?? 'Investimento'}
                      {investment.subtype ? ` · ${investment.subtype}` : ''}
                    </span>
                    {investment.quantity != null && (
                      <span className="mt-0.5">
                        Qtd: {Math.round(investment.quantity)}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              
              <span className="text-white text-sm font-bold">
                {balanceDisplay}
              </span>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white/90 text-xs font-semibold flex items-center justify-center gap-2">
        {hasMore ? 'Ver todos os investimentos' : 'Gerenciar carteira'}
      </button>
    </div>
  );
}