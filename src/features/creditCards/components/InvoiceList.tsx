import type { CreditCardTransaction } from '../types';
import { TransactionItem } from './TransactionItem';

interface InvoiceListProps {
  transactions: CreditCardTransaction[];
  isLoading: boolean;
  appColor?: string; // Cor do banco para destaque
}

export function InvoiceList({ transactions, isLoading, appColor }: InvoiceListProps) {
  // Skeleton Loader (Glassmorphism / Dark Mode)
  if (isLoading) {
    return (
      <div className="flex flex-col mt-4 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 animate-pulse rounded-lg bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="h-3 w-20 bg-white/5 rounded" />
              </div>
            </div>
            <div className="h-6 w-24 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center mt-6 bg-[#18181A] rounded-2xl border border-white/5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-white/80">Nenhuma transação</h3>
        <p className="text-sm text-white/40 mt-1 max-w-sm">
          Não há registros de compras para este mês da fatura. Importe um arquivo OFX para preencher os dados.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1 mt-4">
      {/* Quebra por Dia poderia ser implementada aqui (Agrupar transactions pela Data) */}
      {transactions.map((t) => (
        <TransactionItem 
          key={t.id} 
          transaction={t} 
          appColor={appColor} 
        />
      ))}
    </div>
  );
}
