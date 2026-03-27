import { useMemo, useState } from 'react';
import { useHeatmap } from '../../hooks/useHeatmap';
import type { HeatmapDataPoint } from '../../services/dashboardService';
import dayjs from 'dayjs';

type HeatmapType = 'income' | 'expense';

interface Props {
  type: HeatmapType;
}

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getColor(volume: number, maxVolume: number, type: HeatmapType) {
  if (volume === 0 || maxVolume === 0) return '#222326';

  const ratio = volume / maxVolume;
  
  if (type === 'income') {
    if (ratio < 0.25) return '#14532d'; // dark green
    if (ratio < 0.6) return '#16a34a';  // medium green
    return '#22c55e';                   // light/vibrant green
  } else {
    // Expense colors based on user provided image (red accents)
    if (ratio < 0.25) return '#7f1d1d'; // dark red
    if (ratio < 0.6) return '#dc2626';  // medium red
    return '#ef4444';                   // bright red
  }
}

export function TransactionHeatmap({ type }: Props) {
  const { heatmap, isLoading } = useHeatmap();
  const [hoveredCell, setHoveredCell] = useState<{ x: number, y: number, data: any } | null>(null);

  const title = type === 'income' ? 'Atividade de Receitas' : 'Atividade de Despesas';
  const legendLabelMin = 'Menos';
  const legendLabelMax = 'Mais';
  
  const wEEKS_TO_SHOW = 39; // exactly 9 months as requested

  const { grid, maxVolume, months } = useMemo(() => {
    const today = dayjs();
    const startDate = today.subtract(wEEKS_TO_SHOW * 7 - 1, 'days');

    const dataMap = new Map<string, HeatmapDataPoint>();
    let apiMaxVolume = 0;

    if (heatmap?.data) {
      heatmap.data.forEach((item) => {
        dataMap.set(item.date, item);
        const volume = type === 'income' ? item.incomeVolume : item.expenseVolume;
        if (volume > apiMaxVolume) {
          apiMaxVolume = volume;
        }
      });
    }

    const maxVolData = apiMaxVolume || 1; 

    const weeks: any[][] = [];
    const monthLabels: { label: string, colIndex: number }[] = [];
    let currentMonthLabel = -1;
    let lastLabelColIndex = -10;

    let currentDate = startDate;

    for (let w = 0; w < wEEKS_TO_SHOW; w++) {
      const week: any[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = currentDate.format('YYYY-MM-DD');
        const apiData = dataMap.get(dateStr);
        
        const volume = apiData ? (type === 'income' ? apiData.incomeVolume : apiData.expenseVolume) : 0;
        const count = apiData ? (type === 'income' ? apiData.incomeCount : apiData.expenseCount) : 0;
        
        week.push({
          date: currentDate.toDate(),
          dateStr,
          volume,
          count,
        });

        // Detect month change
        const dMonth = currentDate.month();
        if (dMonth !== currentMonthLabel) {
          // Only add a label if it's been at least 3 weeks since the last one to avoid overlap
          if (w - lastLabelColIndex >= 3) {
            const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
            const mLabel = formatter.format(currentDate.toDate());
            monthLabels.push({ 
              label: mLabel.charAt(0).toUpperCase() + mLabel.slice(1), 
              colIndex: w 
            });
            lastLabelColIndex = w;
          }
          currentMonthLabel = dMonth;
        }

        currentDate = currentDate.add(1, 'day');
      }
      weeks.push(week);
    }

    return { grid: weeks, maxVolume: maxVolData, months: monthLabels };
  }, [heatmap, type]);

  if (isLoading) {
    return (
      <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 h-[240px] flex items-center justify-center">
        <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${type === 'income' ? 'border-[#22c55e]' : 'border-[#ef4444]'}`} />
      </div>
    );
  }

  return (
    <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 flex flex-col relative w-full h-[240px] overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {/* A small angled graph icon mockup */}
          <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${type === 'income' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-base">{title}</h3>
        </div>
        <span className="text-white/40 text-xs font-medium">Últimos meses</span>
      </div>

      <div className="flex select-none">
        <div className="flex flex-col gap-[3px] mt-[18px] mr-2 text-white/40 text-[10px] uppercase font-medium justify-between font-mono">
          <span className="h-[10px]" /> {/* DOM */}
          <span className="h-[10px] leading-[10px]">Seg</span> {/* SEG */}
          <span className="h-[10px]" /> {/* TER */}
          <span className="h-[10px] leading-[10px]">Qua</span> {/* QUA */}
          <span className="h-[10px]" /> {/* QUI */}
          <span className="h-[10px] leading-[10px]">Sex</span> {/* SEX */}
          <span className="h-[10px]" /> {/* SAB */}
        </div>
        
        <div className="flex-1 overflow-x-hidden overflow-y-hidden pt-1 pb-4">
          <div className="relative min-w-max">
            {/* Months Row */}
            <div className="flex mb-2 h-4 relative w-full">
              {months.map((m, i) => (
                <span 
                  key={i} 
                  className="absolute text-white/40 text-[10px] uppercase font-medium font-mono tracking-wider"
                  style={{ left: m.colIndex * 15 }} // Assuming 12px square + 3px gap = 15px step
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {grid.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-[3px]">
                  {week.map((cell: any, dIndex: number) => {
                    const color = getColor(cell.volume, maxVolume, type);
                    
                    return (
                      <div
                        key={dIndex}
                        className="w-3 h-3 rounded-[2px] transition-all hover:ring-1 hover:ring-white/40 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                            data: cell
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend fixed to bottom right of component */}
      <div className="absolute bottom-6 right-6 flex text-[10px] text-white/40 font-medium font-mono items-center gap-2">
        <span>{legendLabelMin}</span>
        <div className="flex gap-[3px]">
          <div className="w-[10px] h-[10px] rounded-[2px] bg-[#222326]" />
          <div className={`w-[10px] h-[10px] rounded-[2px] ${type === 'income' ? 'bg-[#14532d]' : 'bg-[#7f1d1d]'}`} />
          <div className={`w-[10px] h-[10px] rounded-[2px] ${type === 'income' ? 'bg-[#16a34a]' : 'bg-[#dc2626]'}`} />
          <div className={`w-[10px] h-[10px] rounded-[2px] ${type === 'income' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
        </div>
        <span>{legendLabelMax}</span>
      </div>

      {hoveredCell && (
        <div 
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col items-center"
          style={{ left: hoveredCell.x, top: hoveredCell.y }}
        >
          <div className="bg-[#10131f] border border-white/10 px-3 py-2 rounded-lg shadow-xl text-center whitespace-nowrap">
            <p className="text-white/90 text-xs font-semibold mb-1">
              {new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(hoveredCell.data.date)}
            </p>
            <p className="text-white/60 text-xs text-left">
              {hoveredCell.data.count} {hoveredCell.data.count === 1 ? 'transação' : 'transações'}
            </p>
            {hoveredCell.data.volume > 0 && (
              <p className={`font-medium text-xs text-left mt-0.5 ${type === 'income' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {type === 'income' ? 'Recebido: ' : 'Gasto: '}{formatCurrencyBRL(hoveredCell.data.volume)}
              </p>
            )}
          </div>
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#10131f]" />
        </div>
      )}
    </div>
  );
}
