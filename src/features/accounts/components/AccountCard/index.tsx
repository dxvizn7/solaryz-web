import type { ReactNode } from 'react';
import { Building2 } from 'lucide-react'; 
import * as S from './styles';

interface AccountCardProps {
  name: string;
  currencyCode: string;
  balance: number | string;
  icon?: ReactNode;
  bankLogo?: string;
  type?: string;
  isHidden?: boolean;
}

export function AccountCard({
  name,
  currencyCode,
  balance,
  icon,
  bankLogo,
  type,
  isHidden = false,
}: AccountCardProps) {
  
  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(balance));

  const balanceDisplay = isHidden ? 'R$\u00A0••••' : formattedBalance;

  const translateType = (accountType?: string) => {
    if (accountType === 'CHECKING_ACCOUNT') return 'Conta Corrente';
    if (accountType === 'SAVINGS_ACCOUNT') return 'Conta Poupança';
    if (accountType === 'CREDIT_CARD') return 'Cartão de Crédito';
    return accountType;
  };

  const avatar = bankLogo ? (
    <img
      src={bankLogo}
      alt={`Logo ${name}`}
      className="h-10 w-10 rounded-lg object-contain"
      loading="lazy"
      onError={(e) => {
        // Fallback inteligente: se a imagem quebrar, esconde a tag img 
        // e mostra a primeira letra do banco em texto!
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement!.innerHTML = `<span class="font-bold text-xl text-solar-orange">${name.charAt(0).toUpperCase()}</span>`;
      }}
    />
  ) : (
    icon || <Building2 size={24} />
  );

  return (
    <div className={S.card}>
      <div className="flex items-center gap-4">
        {/* Container da logo ajustado para ficar mais premium e com fundo branco */}
        <div className="w-12 h-12 bg-white rounded-xl text-gray-500 shadow-sm flex items-center justify-center shrink-0 p-1">
          {avatar}
        </div>
        
        <div className={S.bankInfo}>
          <span className={S.bankName}>{name}</span>
          <span className={S.currency}>
            {type ? `${translateType(type)} · ` : ''}Moeda: {currencyCode}
          </span>
        </div>
      </div>
      
      <span className={S.balance}>{balanceDisplay}</span>
    </div>
  );
}