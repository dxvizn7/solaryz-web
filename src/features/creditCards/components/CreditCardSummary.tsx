import { useMemo } from 'react';
import { Trash2, Wifi } from 'lucide-react';

interface CreditCard {
  id: number;
  name: string;
  limit: string;
  closing_day: number;
  color?: string;
  account_ending?: string;
}

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

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="flex flex-col gap-4 max-w-[360px] w-full mx-auto sm:mx-0">
      {/* Physical Card Representation */}
      <div 
        className="relative overflow-hidden rounded-2xl p-5 text-white shadow-2xl shadow-black/50 border border-white/10 flex flex-col justify-between group transition-transform duration-300 hover:-translate-y-2"
        style={{ 
          backgroundColor: card.color || '#333',
          aspectRatio: '1.58 / 1',
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.2) 100%)`
        }}
      >
        {/* Shimmer / Holographic Light Reflection Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none transform -translate-x-full group-hover:translate-x-full" />
        
        {/* Subtle noise effect overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
        />

        <div className="relative z-10 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-wider opacity-95 drop-shadow-md">{card.name}</h2>
            <p className="text-[10px] opacity-70 uppercase tracking-[0.2em] font-medium">Credit</p>
          </div>
          
          <div className="flex items-center gap-4">
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md transition-colors text-white/50 hover:text-red-400 opacity-0 group-hover:opacity-100"
                title="Excluir Cartão"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            )}
            {/* Contactless Icon */}
            <Wifi size={24} strokeWidth={2.5} className="rotate-90 opacity-80" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-end gap-1 mb-2">
           {/* EMV Metallic Chip */}
           <div className="w-11 h-8 rounded-[4px] bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] mb-1 overflow-hidden relative shadow-inner opacity-90 border border-black/30">
             {/* Chip structural lines */}
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20 transform -translate-y-1/2"></div>
             <div className="absolute top-0 left-1/3 w-[1px] h-full bg-black/20"></div>
             <div className="absolute top-0 right-1/3 w-[1px] h-full bg-black/20"></div>
             <div className="absolute top-1/4 left-0 w-full h-[1px] bg-black/20"></div>
             <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-black/20"></div>
             <div className="absolute top-1/2 left-1/2 w-4 h-[14px] border border-black/20 rounded-sm transform -translate-x-1/2 -translate-y-1/2"></div>
           </div>
        </div>

        <div className="relative z-10 flex justify-between items-end">
          <div className="flex flex-col">
             {/* Account Number Mock */}
             <p className="font-mono text-lg tracking-[0.25em] opacity-85 drop-shadow-sm font-semibold">
                •••• •••• •••• {card.account_ending || '****'}
             </p>
             <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1 font-medium">Fechamento Dia {card.closing_day}</p>
          </div>
          
          <div className="flex items-center opacity-90 drop-shadow-md">
            {/* Generic Brand Fake Logo */}
            <div className="flex">
              <div className="w-9 h-9 rounded-full bg-white/40 -mr-4 mix-blend-screen" />
              <div className="w-9 h-9 rounded-full bg-white/20 mix-blend-screen" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Analytics Panel */}
      <div className="bg-[#18181A] rounded-xl p-5 border border-white/10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-solar-orange/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex justify-between items-end mb-3 relative z-10">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Limite Usado</p>
            <h3 className="text-xl font-bold tracking-tight text-white">{formatter.format(usedLimit)}</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Limite Total</p>
            <p className="font-medium text-gray-300">{formatter.format(totalLimit)}</p>
          </div>
        </div>

        <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden mt-3 relative z-10 shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F2A416] to-[#E85D04] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentageUsed}%`, boxShadow: percentageUsed > 0 ? '0 0 10px rgba(242,164,22,0.4)' : 'none' }}
          />
        </div>
        <div className="flex justify-between mt-2.5 relative z-10">
          <p className="text-[10px] uppercase font-bold text-gray-500">0%</p>
          <p className="text-[10px] uppercase font-bold text-[#F2A416] tracking-wider bg-solar-orange/10 px-2 py-0.5 rounded-full">
            {percentageUsed.toFixed(1)}% Consumido
          </p>
          <p className="text-[10px] uppercase font-bold text-gray-500">100%</p>
        </div>
      </div>
    </div>
  );
}
