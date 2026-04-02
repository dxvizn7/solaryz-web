import type { CreditCardTransaction } from '../types';

interface TransactionItemProps {
  transaction: CreditCardTransaction;
  appColor?: string; // Cor do banco ou do tema primário para destaques
}

export function TransactionItem({ transaction, appColor = '#8A05BE' }: TransactionItemProps) {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const rawValue = parseFloat(transaction.amount);
  const isExpense = rawValue < 0;
  const absValue = Math.abs(rawValue);

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors rounded-lg group">
      {/* Esquerda: Ícone e Descrição */}
      <div className="flex items-center gap-4">
        {/* Ícone Categoria / Fallback */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ 
            backgroundColor: transaction.category?.color ? `${transaction.category.color}20` : '#2A2A2A',
            color: transaction.category?.color || '#FFFFFF80'
          }}
        >
          {transaction.category?.icon ? (
            <span className="material-icons text-sm">{transaction.category.icon}</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          )}
        </div>

        {/* Textos */}
        <div className="flex flex-col">
          <span className="text-[15px] font-medium text-white/90">
            {transaction.description}
          </span>
          
          <div className="flex items-center gap-2 mt-1">
            {/* Categoria ou Data */}
            <span className="text-xs text-white/40">
              {transaction.category?.name || 'Geral'} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
            </span>

            {/* Crachá de Parcela (badge) */}
            {transaction.is_installment && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-white/10 text-white/70">
                Parcela {String(transaction.installment_current).padStart(2, '0')}/{String(transaction.installment_total).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Direita: Valores */}
      <div className="flex flex-col items-end text-right">
        {/* Valor Principal (Se for parcela, mostrar o valor da parcela. Se for único, mostrar o valor) */}
        <span 
          className="text-[16px] font-semibold tracking-wide"
          style={{ color: transaction.is_installment ? appColor : (isExpense ? '#FFFFFF' : '#4ade80') }}
        >
          {isExpense && !transaction.is_installment ? '- ' : (isExpense ? '' : '+ ')}
          {formatter.format(absValue)}
        </span>
        
        {/* Valor Total da Compra (se for parcela) */}
        {transaction.is_installment && transaction.total_purchase_amount && (
          <span className="text-[11px] text-white/40 mt-1">
            Total: {formatter.format(parseFloat(transaction.total_purchase_amount))}
          </span>
        )}
      </div>
    </div>
  );
}
