import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { BenchmarkPoint, PortfolioSeriesPoint } from '../../types/analytics';
import { formatCurrencyBRL, formatMonthLabel, formatPercent } from '../../utils/formatters';

type Props = {
  series: PortfolioSeriesPoint[];
  benchmark: BenchmarkPoint[];
};

export function InvestmentPerformanceChart({ series, benchmark }: Props) {
  const benchmarkMap = new Map(benchmark.map((item) => [item.month, item.performance_pct]));

  const data = series.map((point) => ({
    month: point.month,
    label: formatMonthLabel(point.month),
    total: point.total,
    benchmark: benchmarkMap.get(point.month),
  }));

  const hasBenchmark = benchmark.length > 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-[320px]">
      <h3 className="text-white/90 text-sm font-semibold mb-4">Carteira x Benchmark</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            tickFormatter={(value: number) => formatCurrencyBRL(value)}
          />
          {hasBenchmark && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              tickFormatter={(value: number) => formatPercent(value)}
            />
          )}
          <Tooltip
            contentStyle={{
              background: '#10131f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
            formatter={(value: number, name: string) => {
              if (name === 'Carteira') return formatCurrencyBRL(value);
              return formatPercent(value);
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total"
            name="Carteira"
            stroke="#F2A416"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          {hasBenchmark && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="benchmark"
              name="Benchmark"
              stroke="#7DD3FC"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
