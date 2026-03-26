import { memo, useMemo } from 'react';
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

const CHART_MARGIN = { top: 8, right: 10, left: 0, bottom: 12 };
const TICK_STYLE = { fill: 'rgba(255,255,255,0.6)', fontSize: 12 };
const TOOLTIP_CONTENT_STYLE = {
  background: '#10131f',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
};
const TOOLTIP_LABEL_STYLE = { color: 'rgba(255,255,255,0.7)' };

const DOT_CARTEIRA = { r: 3 };
const DOT_BENCHMARK = { r: 2 };

function formatYAxisLeft(value: any) {
  return formatCurrencyBRL(value);
}

function formatYAxisRight(value: any) {
  return formatPercent(value);
}

function formatTooltip(value: any, name: any) {
  if (name === 'Carteira') return formatCurrencyBRL(value);
  return formatPercent(value);
}

export const InvestmentPerformanceChart = memo(function InvestmentPerformanceChart({ series, benchmark }: Props) {
  const data = useMemo(() => {
    const benchmarkMap = new Map(benchmark.map((item) => [item.month, item.performance_pct]));

    return series.map((point) => ({
      month: point.month,
      label: formatMonthLabel(point.month),
      total: point.total,
      benchmark: benchmarkMap.get(point.month),
    }));
  }, [series, benchmark]);

  const hasBenchmark = benchmark.length > 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-[320px]">
      <h3 className="text-white/90 text-sm font-semibold mb-4">Carteira x Benchmark</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" tick={TICK_STYLE} />
          <YAxis
            yAxisId="left"
            tick={TICK_STYLE}
            tickFormatter={formatYAxisLeft}
          />
          {hasBenchmark && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={TICK_STYLE}
              tickFormatter={formatYAxisRight}
            />
          )}
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            formatter={formatTooltip}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total"
            name="Carteira"
            stroke="#F2A416"
            strokeWidth={2.5}
            dot={DOT_CARTEIRA}
            isAnimationActive={false}
          />
          {hasBenchmark && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="benchmark"
              name="Benchmark"
              stroke="#7DD3FC"
              strokeWidth={2}
              dot={DOT_BENCHMARK}
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
