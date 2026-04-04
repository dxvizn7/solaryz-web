import { useState, useRef, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../config/api';
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet, RefreshCw, Upload, ChevronDown, CreditCard as CreditCardIcon, Landmark, Info } from 'lucide-react';
import { useAccounts } from '../../../accounts/hooks/useAccounts';
import { useInvestments } from '../../../investments/hooks/useInvestments';
import { useTransactionSummary } from '../../../transactions/hooks/useTransactionSummary';
import { useNotification } from '../../../../contexts/NotificationContext';
import { AccountList } from '../../../accounts/components/AccountList';
import { InvestmentList } from '../../../investments/components/InvestmentList';
import { InvestmentsAnalyticsPanel } from '../../../investments/components/InvestmentsAnalyticsPanel';
import { CategoryExpenseList } from '../../../categories/components/CategoryExpenseList';
import { MonthlyCashFlowChart } from '../MonthlyCashFlowChart';
import { TransactionHeatmap } from '../TransactionHeatmap';
import { mainContainer, leftColumn, rightColumn } from './styles';

type ActiveView = 'balance' | 'investments';

export function BalanceSummary() {
  const [activeView, setActiveView] = useState<ActiveView>('balance');
  const [hidden, setHidden] = useState(false);

  const { accounts, totalBalance, refetch, isRefetching } = useAccounts();
  const { investments, totalInvested, isLoading: isLoadingInvestments } = useInvestments();
  const { summary } = useTransactionSummary();
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  // Extrai os cartões diretamente das contas já carregadas
  const creditCards = useMemo(
    () => accounts.flatMap(acc => acc.credit_cards ?? []),
    [accounts]
  );
  const [importDestination, setImportDestination] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSelectedDestinationText = () => {
    if (!importDestination) return '🤖 Destino Automático';
    const [type, id] = importDestination.split('-');
    if (type === 'account') {
      const acc = accounts.find(a => a.id.toString() === id);
      return acc ? acc.name : 'Conta Desconhecida';
    }
    if (type === 'credit_card') {
      const card = creditCards.find(c => c.id.toString() === id);
      return card ? `${card.name} (Final ${card.account_ending ?? '***'})` : 'Cartão Desconhecido';
    }
    return '🤖 Destino Automático';
  };


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const isBalance = activeView === 'balance';

  return (
    <div className="flex flex-col gap-6 mt-6 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('balance')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${isBalance
                ? 'bg-solar-orange text-white shadow-md'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
          >
            <Wallet size={14} />
            Saldo
          </button>
          <button
            onClick={() => setActiveView('investments')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${!isBalance
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

              addNotification({
                type: 'success',
                message: `Sucesso! ${data.message} ${data.transactions_found ? `(${data.transactions_found} transações encontradas)` : ''}`
              });
              // Invalida todos os caches relevantes sem recarregar a página
              await queryClient.invalidateQueries({ queryKey: ['accounts'] });
              await queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
              await queryClient.invalidateQueries({ queryKey: ['categoryExpenses'] });
              await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            } catch (err: any) {
              if (err.response?.status === 422) {
                addNotification({ type: 'warning', message: err.response.data.message });
              } else {
                addNotification({ type: 'error', message: 'Ocorreu um erro ao processar o extrato global.' });
              }
            } finally {
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }
          }}
        />

        <div className="flex items-center gap-3">
          {/* Dropdown Customizado de Destino */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => !isUploading && setIsDropdownOpen(!isDropdownOpen)}
              disabled={isUploading}
              className="flex items-center justify-between gap-3 bg-[#1a1a2e]/80 backdrop-blur-md border border-white/10 hover:border-solar-orange/50 text-white text-sm rounded-full px-5 py-2.5 transition-all duration-300 disabled:opacity-50 shadow-lg group min-w-[240px]"
              title="Selecione o destino caso queira forçar a importação, caso contrário, deixe Automático."
            >
              <span className="truncate font-medium text-white/90">{getSelectedDestinationText()}</span>
              <ChevronDown size={16} className={`text-solar-orange transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full z-50 right-0 mt-2 w-72 bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-sm origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-blue-500/10 border-b border-blue-500/20 flex items-start gap-2">
                  <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-200/80 leading-tight">
                    A importação atualizará o saldo a partir da data do arquivo, substituindo o Saldo Inicial.
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                  {/* Opção Automática */}
                  <div
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${importDestination === '' ? 'bg-solar-orange/10 text-solar-orange border border-solar-orange/20' : 'text-white/80 hover:bg-white/5 hover:text-white border border-transparent'}`}
                    onClick={() => { setImportDestination(''); setIsDropdownOpen(false); }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 shadow-inner">🤖</div>
                    <span className="font-semibold text-sm">Destino Automático</span>
                  </div>

                  {/* Grupo Contas */}
                  {accounts.length > 0 && (
                    <div className="mt-4">
                      <div className="px-3 pb-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Contas (Débito)</div>
                      <div className="flex flex-col gap-1">
                        {accounts.map(acc => (
                          <div
                            key={`acc_${acc.id}`}
                            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${importDestination === `account-${acc.id}` ? 'bg-solar-orange/10 text-solar-orange border border-solar-orange/20' : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'}`}
                            onClick={() => { setImportDestination(`account-${acc.id}`); setIsDropdownOpen(false); }}
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 shadow-inner">
                              <Landmark size={14} className={importDestination === `account-${acc.id}` ? 'text-solar-orange' : 'text-gray-400'} />
                            </div>
                            <span className="truncate flex-1 font-medium">{acc.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grupo Cartões */}
                  {creditCards.length > 0 && (
                    <div className="mt-4 mb-2">
                      <div className="px-3 pb-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Cartões de Crédito</div>
                      <div className="flex flex-col gap-1">
                        {creditCards.map(card => (
                          <div
                            key={`card_${card.id}`}
                            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${importDestination === `credit_card-${card.id}` ? 'bg-solar-orange/10 text-solar-orange border border-solar-orange/20' : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'}`}
                            onClick={() => { setImportDestination(`credit_card-${card.id}`); setIsDropdownOpen(false); }}
                          >
                            <div
                              className="flex items-center justify-center w-8 h-[22px] rounded-md shadow-md border border-white/20 relative overflow-hidden shrink-0"
                              style={{ backgroundColor: card.color || '#333' }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 mix-blend-overlay"></div>
                              <CreditCardIcon size={12} className="text-white relative z-10 opacity-90 drop-shadow-md" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="truncate font-medium text-sm leading-tight">{card.name}</span>
                              <span className="text-[10px] opacity-70 font-mono tracking-widest mt-0.5" style={{ color: importDestination === `credit_card-${card.id}` ? '#E85D04' : '#9ca3af' }}>
                                FINAL {card.account_ending ?? '***'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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