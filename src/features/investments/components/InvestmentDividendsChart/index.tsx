import { memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DividendsMonthlyPoint } from '../../types/analytics';
import { formatCurrencyBRL, formatMonthLabel } from '../../utils/formatters';

type Props = {
  monthly: DividendsMonthlyPoint[];
};

const CHART_MARGIN = { top: 8, right: 10, left: 0, bottom: 12 };
const TICK_STYLE = { fill: 'rgba(255,255,255,0.6)', fontSize: 12 };
const TOOLTIP_CONTENT_STYLE = {
  background: '#10131f',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
};

function formatYAxis(value: any) {
  return formatCurrencyBRL(value);
}

function formatTooltip(value: any) {
  return formatCurrencyBRL(value);
}

export const InvestmentDividendsChart = memo(function InvestmentDividendsChart({ monthly }: Props) {
  const data = useMemo(() => {
    return monthly.map((item) => ({
      month: formatMonthLabel(item.month),
      total: item.total,
    }));
  }, [monthly]);

  if (monthly.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-[300px] flex items-center justify-center text-white/40 text-sm">
        Sem dividendos no periodo
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-[300px]">
      <h3 className="text-white/90 text-sm font-semibold mb-4">Dividendos Mensais</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="month" tick={TICK_STYLE} />
          <YAxis
            tick={TICK_STYLE}
            tickFormatter={formatYAxis}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            formatter={formatTooltip}
          />
          <Bar dataKey="total" fill="#F2A416" radius={[6, 6, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
