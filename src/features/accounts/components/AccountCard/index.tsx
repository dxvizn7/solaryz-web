import type { ReactNode } from 'react';
import { Building2 } from 'lucide-react'; 

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
    if (accountType === 'CHECKING_ACCOUNT') return 'C. Corrente';
    if (accountType === 'SAVINGS_ACCOUNT') return 'Poupança';
    if (accountType === 'CREDIT_CARD') return 'Cartão';
    return accountType;
  };

  const avatar = bankLogo ? (
    <img
      src={bankLogo}
      alt={`Logo ${name}`}
      className="h-8 w-8 rounded-lg object-contain"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement!.innerHTML = `<span class="font-bold text-sm text-solar-orange">${name.charAt(0).toUpperCase()}</span>`;
      }}
    />
  ) : (
    icon || <Building2 size={18} className="text-gray-400" />
  );

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 p-1">
          {avatar}
        </div>
        <div className="flex flex-col">
          <span className="text-white/90 text-sm font-semibold">{name}</span>
          <span className="text-white/40 text-xs">
            {type ? `${translateType(type)}` : currencyCode}
          </span>
        </div>
      </div>
      <span className="text-white text-sm font-bold">{balanceDisplay}</span>
    </div>
  );
}