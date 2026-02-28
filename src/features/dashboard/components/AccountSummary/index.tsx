import { SummaryCard } from '../../../../components/SummaryCard'; 
import { AccountList } from '../../../accounts/components/AccountList';
import { Wallet } from 'lucide-react';
import { useSummary } from '../../hooks/useSummary';

export function AccountSummary() {
  const { totalBalance } = useSummary(); 

  return (
    <div className="flex flex-col gap-10 mt-6">
      <section>
        <SummaryCard
          title="Saldo Total"
          value={totalBalance}
          subtitle="Atualizado agora mesmo"
          icon={<Wallet size={20} />}
        />
      </section>

      <section>
        <AccountList />
      </section>
    </div>
  );
}