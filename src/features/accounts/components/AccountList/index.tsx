import { Building2 } from 'lucide-react';
import * as S from './styles';
import { useAccounts } from '../../hooks/useAccounts';

export function AccountList() {
  const { accounts, isLoading } = useAccounts();

  if (isLoading) return null;

  return (
    <div className={S.container}>
      <h2 className={S.title}>Minhas Contas</h2>
      
      <div className={S.list}>
        {accounts.map((account) => (
          <div key={account.id} className={S.card}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Building2 size={20} className="text-gray-500" />
              </div>
              
              <div className={S.bankInfo}>
                <span className={S.bankName}>{account.name}</span>
                <span className={S.currency}>Moeda: {account.currency_code}</span>
              </div>
            </div>

            <span className={S.balance}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                .format(Number(account.balance))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}