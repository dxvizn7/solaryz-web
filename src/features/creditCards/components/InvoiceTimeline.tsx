import type { InvoicePeriod } from '../types';

interface InvoiceTimelineProps {
  periods: InvoicePeriod[];
  selectedPeriod: string;
  onSelectPeriod: (monthIso: string) => void;
}

export function InvoiceTimeline({ periods, selectedPeriod, onSelectPeriod }: InvoiceTimelineProps) {
  // Verificação de segurança ou placeholder
  if (!periods || periods.length === 0) {
    return (
      <div className="flex animate-pulse space-x-4 overflow-x-auto py-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-[#2A2A2A] rounded-full shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full py-4">
      {/* Scrollable Container */}
      <div className="flex overflow-x-auto gap-3 items-center no-scrollbar px-2 pb-2">
        {periods.map((period) => {
          const isActive = period.month === selectedPeriod;

          return (
            <button
              key={period.month}
              onClick={() => onSelectPeriod(period.month)}
              className={`
                group shrink-0 relative px-6 py-2.5 rounded-full text-sm font-medium
                transition-all duration-300 ease-in-out border
                ${isActive 
                  ? 'bg-white text-black border-transparent shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-105' 
                  : 'bg-[#18181A] text-white/60 border-white/5 hover:border-white/20 hover:text-white/90'}
              `}
            >
              {/* Conteúdo Visível */}
              <span className="relative z-10 flex flex-col items-center">
                <span className="capitalize">{period.label}</span>
                {isActive && (
                  <span className="text-[10px] font-bold opacity-80 mt-0.5 tracking-wider">
                    {period.year}
                  </span>
                )}
              </span>

              {/* Indicador de Status Abaixo (Apenas como charme visual se ativo) */}
              {isActive && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-40 blur-sm" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Sombreamento lateral para indicar scroll se tiver muitos meses e transbordar o flex box */}
      <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#121212] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#121212] to-transparent pointer-events-none" />
    </div>
  );
}
