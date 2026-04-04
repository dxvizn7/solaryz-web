import { useState, useEffect } from 'react';
import { Wallet, Plus, Building } from 'lucide-react';
import { bankAccountsService } from '../services/bankAccountsService';
import type { BankAccount, PlanInfo } from '../types/bankAccount';
import { AddBankAccountModal } from '../components/AddBankAccountModal';
import { BankAccountCard } from '../components/BankAccountCard';
import { PlanLimitBadge } from '../components/PlanLimitBadge';
import { Layout } from '../../../components/Layout';
import { useNotification } from '../../../contexts/NotificationContext';

export function BankAccountsPage() {
  const { addNotification } = useNotification();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedAccounts, fetchedPlan] = await Promise.all([
        bankAccountsService.getAccounts(),
        bankAccountsService.getPlanInfo()
      ]);
      setAccounts(fetchedAccounts);
      setPlanInfo(fetchedPlan);
    } catch (error) {
      addNotification({ type: 'error', message: 'Erro ao carregar dados das contas.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAccount = async (id: number) => {
    if (!window.confirm("Certeza que deseja excluir esta conta e todos os seus cartões?")) return;
    try {
      await bankAccountsService.deleteAccount(id);
      addNotification({ type: 'success', message: 'Conta excluída com sucesso.' });
      fetchData();
    } catch (error) {
      addNotification({ type: 'error', message: 'Falha ao deletar a conta.' });
    }
  };

  const handleCreateNewAccountClick = () => {
    if (!planInfo) return;
    
    const usage = planInfo?.usage?.bank_accounts || { used: 0, limit: 999 };
    const isAtLimit = usage.used >= usage.limit && !planInfo?.features?.unlimited_accounts;
    
    if (isAtLimit) {
      addNotification({ type: 'warning', message: 'Você atingiu o limite de contas do seu plano. Faça o upgrade para criar mais contas.' });
      return;
    }

    setIsAddModalOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Building className="text-[#F2910A]" size={32} />
              Contas e Cartões
            </h1>
            <p className="text-white/50 mt-1 font-medium">
              Gerencie suas contas bancárias e cartões de crédito centralizados.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             {planInfo && (
               <>
                 <PlanLimitBadge planInfo={planInfo} type="bank_accounts" />
                 <button
                    onClick={handleCreateNewAccountClick}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#F2910A] to-[#E85D04] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#F2910A]/20"
                  >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Nova Conta</span>
                 </button>
               </>
             )}
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
           <div className="flex justify-center items-center py-20">
             <div className="w-10 h-10 border-4 border-[#F2910A]/20 border-t-[#F2910A] rounded-full animate-spin"></div>
           </div>
        ) : accounts.length === 0 ? (
           <div className="bg-[#1C1C21] rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-[#F2910A]/10 rounded-full flex items-center justify-center text-[#F2910A] mb-6">
               <Wallet size={40} />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Nenhuma conta cadastrada</h2>
             <p className="text-white/40 max-w-md mx-auto mb-8">
               Crie sua primeira conta bancária para começar a gerenciar seu fluxo de caixa e registrar seus cartões de crédito.
             </p>
             <button
                onClick={handleCreateNewAccountClick}
                className="flex items-center gap-2 bg-[#F2910A] hover:bg-[#E85D04] text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                <Plus size={20} />
                Criar Minha Primeira Conta
             </button>
           </div>
        ) : (
           <div className="flex flex-col gap-6">
             {accounts.map(account => (
               <BankAccountCard 
                 key={account.id}
                 account={account}
                 planInfo={planInfo!}
                 onCardAdded={fetchData}
                 onDeleteAccount={handleDeleteAccount}
               />
             ))}
           </div>
        )}

      </div>

      <AddBankAccountModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />
    </Layout>
  );
}
