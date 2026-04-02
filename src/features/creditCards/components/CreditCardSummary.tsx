import type { CreditCard } from '../types';
import { useMemo } from 'react';
import { Trash2 } from 'lucide-react';

interface CreditCardSummaryProps {
  card: CreditCard;
  usedLimit: number;
  onDelete?: (id: number) => void;
}

export function CreditCardSummary({ card, usedLimit, onDelete }: CreditCardSummaryProps) {
  const totalLimit = parseFloat(card.limit);
  
  const percentageUsed = useMemo(() => {
    if (totalLimit === 0) return 0;
    const calc = (usedLimit / totalLimit) * 100;
    return calc > 100 ? 100 : calc;
  }, [usedLimit, totalLimit]);

  // Formatação em BRL
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg border border-white/10"
      style={{ backgroundColor: card.color || '#333' }}
    >
      {/* Elementos de Decoração Glassmorphism / Patterns */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold opacity-90 tracking-wide">{card.name}</h2>
            <p className="text-sm opacity-70 uppercase tracking-widest mt-1">Fechamento dia {card.closing_day}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
                className="p-2 rounded-lg bg-black/10 hover:bg-black/30 backdrop-blur-sm transition-colors text-white/50 hover:text-red-400 group"
                title="Excluir Cartão (Histórico inteiro será perdido)"
              >
                <Trash2 size={18} className="transition-transform group-hover:scale-110" strokeWidth={2} />
              </button>
            )}
            
            <div className="flex items-center justify-center p-2 rounded-lg bg-black/20 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Limite Usado</p>
              <h3 className="text-2xl font-bold">{formatter.format(usedLimit)}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Limite Total</p>
              <p className="font-medium opacity-90">{formatter.format(totalLimit)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm mt-3">
            <div 
              className="h-full bg-white rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
          <p className="text-xs text-right mt-2 opacity-60">
            {percentageUsed.toFixed(1)}% utilizado
          </p>
        </div>
      </div>
    </div>
  );
}
