import { useState, useEffect, useMemo, useRef } from 'react';
import { Layout } from '../../../components/Layout';
import { creditCardService } from '../services/creditCardService';
import type { CreditCard, CreditCardTransaction, InvoicePeriod } from '../types';
import { CreditCardSummary } from '../components/CreditCardSummary';
import { InvoiceTimeline } from '../components/InvoiceTimeline';
import { InvoiceList } from '../components/InvoiceList';
import { CreateCreditCardModal } from '../components/CreateCreditCardModal';

// Helper para gerar os últimos 6 meses fáceis de mockar
const getRecentMonths = (): InvoicePeriod[] => {
  const periods: InvoicePeriod[] = [];
  const currentDate = new Date();

  for (let i = -2; i <= 3; i++) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthIso = d.toISOString().substring(0, 7); // yyyy-MM

    periods.push({
      month: monthIso,
      label: d.toLocaleDateString('pt-BR', { month: 'long' }),
      year: d.getFullYear().toString(),
    });
  }
  return periods.sort((a, b) => a.month.localeCompare(b.month)); // Mais antigo pro mais novo
};

export function CreditCardsPage() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const [periods] = useState<InvoicePeriod[]>(getRecentMonths());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );

  const [transactions, setTransactions] = useState<CreditCardTransaction[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // States for new actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Carrega Cartões
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await creditCardService.getCreditCards();
        setCards(data);
        if (data.length > 0) {
          setSelectedCardId(data[0].id); // Seleciona o primeiro por padrão
        }
      } catch (error) {
        console.error('Erro ao carregar cartões', error);
      } finally {
        setIsLoadingCards(false);
      }
    };
    fetchCards();
  }, []);

  // 2. Carrega Transações quando muda o cartão ativo ou mês logado
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedCardId || !selectedMonth) return;

      setIsLoadingTransactions(true);
      try {
        // Separa year-month
        const [year, monthNum] = selectedMonth.split('-');

        const data = await creditCardService.getTransactionsByInvoice(selectedCardId, monthNum, year);

        // Garante que setamos um array mesmo se a API devolver objeto solto/erro
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar transações', error);
        setTransactions([]);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [selectedCardId, selectedMonth]);

  // Handlers para Novas Ações
  const handleCreateSuccess = (newCard: CreditCard) => {
    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id);
  };

  const handleDeleteCard = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este cartão? Todo o histórico de faturas será permanentemente apagado.')) return;

    try {
      await creditCardService.deleteCreditCard(id);
      setCards(prev => prev.filter(c => c.id !== id));
      if (selectedCardId === id) {
        setSelectedCardId(null);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Erro ao deletar cartão', error);
      alert('Houve um erro ao tentar excluir o cartão.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCardId) return;

    setIsUploading(true);
    try {
      const resp = await creditCardService.uploadInvoice(selectedCardId, file);
      alert(`Sucesso: ${resp.message}`);

      // Reload as transações para refletir imediato
      setIsLoadingTransactions(true);
      const [year, monthNum] = selectedMonth.split('-');
      const data = await creditCardService.getTransactionsByInvoice(selectedCardId, monthNum, year);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro no upload', error);
      alert('Falha ao processar arquivo OFX.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const activeCard = useMemo(() => cards.find(c => c.id === selectedCardId), [cards, selectedCardId]);

  // --------------------------------------------------------
  // CORREÇÃO: Soma apenas débitos e subtrai os créditos 
  // --------------------------------------------------------
  const calculateUsedLimit = (txs: CreditCardTransaction[]) => {
    if (!Array.isArray(txs)) return 0;
    
    const sum = txs.reduce((acc, t) => {
      const value = parseFloat(t.amount);
      
      if (t.type === 'CREDIT') {
        // Ignora o pagamento da própria fatura para não mascarar o total de gastos
        if (t.description.toLowerCase().includes('pagamento')) {
          return acc; 
        }
        // Se for um estorno normal, ele abate o valor da fatura
        return acc - value;
      }
      
      // Débitos (compras) somam
      return acc + value;
    }, 0);
    
    return Math.max(0, sum);
  };
  
  const activeUsedLimit = useMemo(() => calculateUsedLimit(transactions), [transactions]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0 space-y-8 animate-in fade-in duration-500">

        {/* Header / Titular */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Cartões de Crédito
            </h1>
            <p className="text-white/40 text-sm">
              Gerencie seus limites, acompanhe faturas e importe dados OFX.
            </p>
          </div>

          {/* Ações Globais Header */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F2A416]/10 text-[#F2A416] hover:bg-[#F2A416]/20 border border-[#F2A416]/20 rounded-lg transition-colors text-sm font-semibold"
            >
              + Novo Cartão
            </button>

            {/* Input oculto para o OFX */}
            <input
              type="file"
              accept=".ofx,.xml,.csv,.txt"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {activeCard && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isUploading ? 'animate-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {isUploading ? 'Enviando...' : 'Importar OFX'}
              </button>
            )}
          </div>
        </div>

        {/* Content Box */}
        {isLoadingCards ? (
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        ) : cards.length === 0 ? (
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 text-center text-white/60">
            Nenhum cartão cadastrado ainda. Módulo será adicionado em breve.
          </div>
        ) : (
          <div className="space-y-6">

            {/* Componente: Topo / Resumo Cartão */}
            {activeCard && (
              <CreditCardSummary
                card={activeCard}
                usedLimit={activeUsedLimit}
                onDelete={handleDeleteCard}
              />
            )}

            <div className="bg-[#121212] border border-white/[0.03] rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold mb-2 ml-2">Faturas</h2>

              {/* Componente: Navegação de Meses */}
              <InvoiceTimeline
                periods={periods}
                selectedPeriod={selectedMonth}
                onSelectPeriod={setSelectedMonth}
              />

              <div className="mt-6 border-t border-white/[0.04] pt-4">
                {/* Componente: Lista com os itens e o parcelamento */}
                <InvoiceList
                  transactions={transactions}
                  isLoading={isLoadingTransactions}
                  appColor={activeCard?.color}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateCreditCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Layout>
  );
}