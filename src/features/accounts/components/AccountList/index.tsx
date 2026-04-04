import type { Account } from '../../services/accountsService';
import { AccountCard } from '../AccountCard';

interface Props {
  accounts: Account[];
  isHidden?: boolean; 
}

export function AccountList({ accounts, isHidden = false }: Props) {
  const previewAccounts = accounts.slice(0, 3);
  const hasMore = accounts.length > 3;

  return (
    <div className="bg-[#18181b] rounded-2xl p-5 w-full mt-6 border border-white/5">
      <h2 className="text-white/80 text-sm font-medium mb-4">Minhas Contas</h2>
      
      <div className="flex flex-col">
        {previewAccounts.map((account) => (
          <AccountCard 
            key={account.id}
            name={account.name}
            currencyCode={account.currency_code}
            balance={account.balance}
            bankLogo={account.bank_logo} 
            type={account.type} 
            isHidden={isHidden} 
            creditCards={account.credit_cards}
          />
        ))}
      </div>

      <button className="w-full mt-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white/90 text-xs font-semibold flex items-center justify-center gap-2">
        {hasMore ? 'Ver todas as contas' : 'Gerenciar contas'}
      </button>
    </div>
  );
}