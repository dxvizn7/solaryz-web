import * as S from './styles';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountCard } from '../AccountCard';

export function AccountList() {
  const { accounts, isLoading } = useAccounts();

  if (isLoading) return null;

  return (
    <div className={S.container}>
      <h2 className={S.title}>Minhas Contas</h2>
      
      <div className={S.list}>
        {accounts.map((account) => (
          <AccountCard 
            key={account.id}
            name={account.name}
            currencyCode={account.currency_code}
            balance={account.balance}
          />
        ))}
      </div>
    </div>
  );
}