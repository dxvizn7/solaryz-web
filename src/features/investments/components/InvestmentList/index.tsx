import { TrendingUp } from 'lucide-react';
import type { Investment } from '../../services/investmentsService';
import * as S from '../../../accounts/components/AccountList/styles';

interface Props {
  investments: Investment[];
}

export function InvestmentList({ investments }: Props) {
  return (
    <div className={S.container}>
      <h2 className={S.title}>Meus Investimentos</h2>

      <div className={S.list}>
        {investments.map((investment) => {
          const formattedBalance = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(Number(investment.balance));

          return (
            <div key={investment.id} className={S.card}>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500 border border-gray-100">
                  <TrendingUp size={20} />
                </div>
                <div className={S.bankInfo}>
                  <span className={S.bankName}>{investment.name}</span>
                  <span className={S.currency}>
                    {investment.type ?? 'Investimento'}
                    {investment.subtype ? ` · ${investment.subtype}` : ''}
                  </span>
                  {investment.quantity != null && (
                    <span className="text-xs text-gray-400 mt-0.5">
                      Quantidade: {Math.round(investment.quantity)}
                    </span>
                  )}
                </div>
              </div>
              <span className={S.balance}>{formattedBalance}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}