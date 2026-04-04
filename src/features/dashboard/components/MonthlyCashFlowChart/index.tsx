import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMonthlyCashFlow } from '../../hooks/useMonthlyCashFlow';

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonth(dateString: string) {
  // expects 'YYYY-MM'
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
  const formatted = formatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const CHART_MARGIN = { top: 10, right: 10, left: 0, bottom: 0 };
const TICK_STYLE = { fill: 'rgba(255,255,255,0.5)', fontSize: 12 };

export function MonthlyCashFlowChart() {
  const { cashFlow, isLoading } = useMonthlyCashFlow();

  const data = useMemo(() => {
    if (!cashFlow?.data) return [];
    return cashFlow.data.map(item => ({
      ...item,
      formattedMonth: formatMonth(item.month)
    }));
  }, [cashFlow]);

  if (isLoading) {
    return (
      <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 h-[340px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#F2A416] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 h-[340px] flex flex-col relative w-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-semibold text-lg">Histórico de Caixa</h3>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E94822]" />
              <span className="text-white/60 text-xs font-medium">Saídas</span>
            </div>
          </div>
        </div>
        <span className="text-white/40 text-xs font-medium">Últimos 6 meses</span>
      </div>

      <div className="flex-1 w-full min-h-0 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={CHART_MARGIN}>
            <defs>
              <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E94822" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#E94822" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="formattedMonth" 
              tick={TICK_STYLE} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            <YAxis 
              tick={TICK_STYLE} 
              tickFormatter={(val) => {
                if (val === 0) return '0k';
                return `${val / 1000}k`;
              }}
              axisLine={false} 
              tickLine={false}
              dx={-10}
            />
            <Tooltip 
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#10131f] border border-white/10 rounded-lg p-3 shadow-xl">
                      <p className="text-white/60 text-xs font-semibold mb-2 uppercase tracking-wide">
                        {data.formattedMonth}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center gap-4 text-sm">
                          <span className="text-white/80">Despesas:</span>
                          <span className="text-[#E94822] font-medium">{formatCurrencyBRL(data.expense)}</span>
                        </div>
                        <div className="w-full h-px bg-white/10 my-0.5" />
                        <div className="flex justify-between items-center gap-4 text-sm mt-0.5">
                          <span className="text-white font-medium">Saldo:</span>
                          <span className={`font-semibold ${data.balance >= 0 ? 'text-[#EFD510]' : 'text-[#E94822]'}`}>
                            {data.balance >= 0 ? '+' : ''}{formatCurrencyBRL(data.balance)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#E94822" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSaidas)" 
              activeDot={{ r: 4, fill: '#E94822', stroke: '#18181b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
