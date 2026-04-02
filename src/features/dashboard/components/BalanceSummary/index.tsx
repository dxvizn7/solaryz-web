import { useState, useRef, useEffect } from 'react';
import { api } from '../../../../config/api';
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet, RefreshCw, Upload } from 'lucide-react';
import { useAccounts } from '../../../accounts/hooks/useAccounts';
import { useInvestments } from '../../../investments/hooks/useInvestments';
import { useTransactionSummary } from '../../../transactions/hooks/useTransactionSummary';
import { AccountList } from '../../../accounts/components/AccountList';
import { InvestmentList } from '../../../investments/components/InvestmentList';
import { InvestmentsAnalyticsPanel } from '../../../investments/components/InvestmentsAnalyticsPanel';
import { CategoryExpenseList } from '../../../categories/components/CategoryExpenseList';
import { MonthlyCashFlowChart } from '../MonthlyCashFlowChart';
import { TransactionHeatmap } from '../TransactionHeatmap';
import { creditCardService } from '../../../creditCards/services/creditCardService';
import { mainContainer, leftColumn, rightColumn } from './styles';

type ActiveView = 'balance' | 'investments';

export function BalanceSummary() {
  const [activeView, setActiveView] = useState<ActiveView>('balance');
  const [hidden, setHidden] = useState(false);
  
  const { accounts, totalBalance, refetch, isRefetching } = useAccounts();
  const { investments, totalInvested, isLoading: isLoadingInvestments } = useInvestments();
  const { summary } = useTransactionSummary();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [creditCards, setCreditCards] = useState<any[]>([]);
  const [importDestination, setImportDestination] = useState<string>('');

  useEffect(() => {
    creditCardService.getCreditCards().then(setCreditCards).catch(console.error);
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const isBalance = activeView === 'balance';

  return (
    <div className="flex flex-col gap-6 mt-6 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('balance')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              isBalance
                ? 'bg-solar-orange text-white shadow-md'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <Wallet size={14} />
            Saldo
          </button>
          <button
            onClick={() => setActiveView('investments')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              !isBalance
                ? 'bg-solar-orange text-white shadow-md'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <TrendingUp size={14} />
            Investimentos
          </button>
        </div>
        
        <input 
          type="file" 
          accept=".ofx,.xml,.csv,.txt" 
          className="hidden" 
          ref={fileInputRef}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setIsUploading(true);
            
            try {
              const formData = new FormData();
              formData.append('file', file);
              
              if (importDestination) {
                const [type, id] = importDestination.split('-');
                if (type && id) {
                  formData.append('destination_type', type);
                  formData.append('destination_id', id);
                }
              }
              
              const { data } = await api.post('/statements/import-global', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
              
              alert(`Sucesso! ${data.message} ${data.transactions_found ? `(${data.transactions_found} transações)` : ''}`);
              window.location.reload(); // Recarrega a página inteira para atualizar gráficos, categorias e heatmap
            } catch (err: any) {
              if (err.response?.status === 422) {
                alert(`⚠️ ${err.response.data.message}`);
              } else {
                alert('Ocorreu um erro ao processar o extrato global.');
              }
            } finally {
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }
          }}
        />

        <div className="flex items-center gap-3">
          <select 
            value={importDestination}
            onChange={(e) => setImportDestination(e.target.value)}
            className="bg-[#1a1a2e] border border-white/10 text-white text-sm rounded-full focus:ring-solar-orange focus:border-solar-orange block px-4 py-2 transition-colors disabled:opacity-50 appearance-none shadow-md cursor-pointer hover:bg-[#23233b]"
            disabled={isUploading}
            title="Selecione o destino caso queira forçar a importação, caso contrário, deixe Automático."
          >
            <option value="">🤖 Destino Automático</option>
            <optgroup label="Contas (Débito/Transferências)">
              {accounts.map(acc => (
                <option key={`acc_${acc.id}`} value={`account-${acc.id}`}>{acc.name}</option>
              ))}
            </optgroup>
            <optgroup label="Cartões de Crédito (Fatura)">
              {creditCards.map(card => (
                <option key={`card_${card.id}`} value={`credit_card-${card.id}`}>{card.name} (Final {card.account_ending ?? '***'})</option>
              ))}
            </optgroup>
          </select>

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-solar-orange to-[#E85D04] hover:opacity-90 rounded-full text-sm font-bold text-white shadow-[0_0_20px_rgba(242,164,22,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(242,164,22,0.5)] border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            title="Importar Extrato Oficial (OFX/CSV) das Contas Bancárias ou Cartões"
          >
            <Upload size={16} strokeWidth={2.5} className={isUploading ? 'animate-bounce' : ''} /> 
            {isUploading ? 'Processando...' : 'Importar Extrato'}
          </button>
        </div>
      </div>

      <div className={mainContainer}>
        <div className={leftColumn}>
          {isBalance ? (
            <div className="relative rounded-2xl overflow-hidden w-full">
              <div className="bg-gradient-to-br from-[#F2A416] to-[#E85D04] p-6 relative">
                <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10" />
                <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-white/10" />

                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-white/80 text-sm font-medium">Saldo Total</span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => refetch()}
                      disabled={isRefetching}
                      className={`text-white/70 hover:text-white transition-all ${isRefetching ? 'animate-spin opacity-50' : ''}`}
                      title="Atualizar saldo"
                    >
                      <RefreshCw size={16} />
                    </button>

                    <button
                      onClick={() => setHidden(!hidden)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mb-4">
                  <span className="text-white text-4xl font-bold tracking-tight">
                    {hidden 
                      ? 'R$ ••••••' 
                      : formatCurrency(
                          totalBalance > 0 
                            ? totalBalance 
                            : (summary.total ?? (summary.income - summary.expense)) || 0
                        )
                    }
                  </span>
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
                    <div className="bg-white/20 p-1 rounded-full">
                      <TrendingUp size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Entradas</p>
                      <p className="text-white text-sm font-semibold">
                        {hidden ? '••••' : formatCurrency(summary.income)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
                    <div className="bg-white/20 p-1 rounded-full">
                      <TrendingDown size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Saídas</p>
                      <p className="text-white text-sm font-semibold">
                        {hidden ? '••••' : formatCurrency(summary.expense)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden w-full">
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 relative">
                <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full bg-solar-orange/10" />
                <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-solar-orange/10" />

                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-white/60 text-sm font-medium">Total Investido</span>
                  <button
                    onClick={() => setHidden(!hidden)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative z-10 mb-4">
                  {isLoadingInvestments ? (
                    <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
                  ) : (
                    <span className="text-white text-4xl font-bold tracking-tight">
                      {hidden ? 'R$ ••••••' : formatCurrency(totalInvested)}
                    </span>
                  )}
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                    <div className="bg-solar-orange/30 p-1 rounded-full">
                      <TrendingUp size={12} className="text-solar-orange" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Ativos</p>
                      <p className="text-white text-sm font-semibold">{investments.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isBalance ? (
            <div className="flex flex-col gap-6 w-full mt-4">
              <MonthlyCashFlowChart />
              <div className="w-full">
                <TransactionHeatmap type="expense" />
              </div>
            </div>
          ) : (
            <InvestmentsAnalyticsPanel />
          )}
        </div>

        <div className={rightColumn}>
          <CategoryExpenseList />
          {isBalance ? (
            <AccountList accounts={accounts} isHidden={hidden} />
          ) : (
            <InvestmentList investments={investments} />
          )}
        </div>
      </div>
    </div>
  );
}