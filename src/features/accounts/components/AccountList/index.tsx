import * as S from './styles';
import type { Account } from '../../services/accountsService';
import { AccountCard } from '../AccountCard';

interface Props {
  accounts: Account[];
  isHidden?: boolean; 
}

export function AccountList({ accounts, isHidden = false }: Props) {
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
            bankLogo={account.bank_logo} 
            type={account.type} 
            isHidden={isHidden} 
          />
        ))}
      </div>
    </div>
  );
}