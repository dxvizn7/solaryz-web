import { Wallet } from 'lucide-react';
import * as S from './styles';
import { useAccounts } from '../../../accounts/hooks/useAccounts';

export function AccountSummary() {
  const { totalBalance, isLoading } = useAccounts();

  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalBalance);

  return (
    <div className={S.card}>
      <div className={S.header}>
        <Wallet size={20} className="text-blue-500" />
        <span>Saldo Total</span>
      </div>
      
      <h1 className={S.balance}>
        {isLoading ? 'Carregando...' : formattedBalance}
      </h1> 
      
      <span className={S.updateText}>Atualizado agora mesmo</span>
    </div>
  );
}