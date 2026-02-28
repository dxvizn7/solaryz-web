import type { ReactNode } from 'react';
import { Building2 } from 'lucide-react'; 
import * as S from './styles';

interface AccountCardProps {
  name: string;
  currencyCode: string;
  balance: number | string;
  icon?: ReactNode;
}

export function AccountCard({ name, currencyCode, balance, icon }: AccountCardProps) {
  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(balance));

  return (
    <div className={S.card}>
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-500 border border-gray-100">
           {icon || <Building2 size={20} />}
        </div>
        <div className={S.bankInfo}>
          <span className={S.bankName}>{name}</span>
          <span className={S.currency}>Moeda: {currencyCode}</span>
        </div>
      </div>
      <span className={S.balance}>{formattedBalance}</span>
    </div>
  );
}