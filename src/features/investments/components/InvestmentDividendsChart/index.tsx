import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DividendsMonthlyPoint } from '../../types/analytics';
import { formatCurrencyBRL, formatMonthLabel } from '../../utils/formatters';

type Props = {
  monthly: DividendsMonthlyPoint[];
};

export function InvestmentDividendsChart({ monthly }: Props) {
  if (monthly.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-[300px] flex items-center justify-center text-white/40 text-sm">
        Sem dividendos no periodo
      </div>
    );
  }

  const data = monthly.map((item) => ({
    month: formatMonthLabel(item.month),
    total: item.total,
  }));

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-[300px]">
      <h3 className="text-white/90 text-sm font-semibold mb-4">Dividendos Mensais</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            tickFormatter={(value: number) => formatCurrencyBRL(value)}
          />
          <Tooltip
            contentStyle={{
              background: '#10131f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
            formatter={(value: number) => formatCurrencyBRL(value)}
          />
          <Bar dataKey="total" fill="#F2A416" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
