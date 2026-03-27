import { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { AllocationPoint } from '../../types/analytics';
import { formatCurrencyBRL } from '../../utils/formatters';

const COLORS = ['#F2A416', '#60A5FA', '#34D399', '#F472B6', '#A78BFA', '#F87171'];

type Props = {
  allocation: AllocationPoint[];
};

const TOOLTIP_CONTENT_STYLE = {
  background: '#10131f',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
};

function formatTooltip(_: any, __: any, payload: any) {
  const point = payload?.payload as AllocationPoint | undefined;
  if (!point) return '';
  return `${point.percentage.toFixed(2)}% (${formatCurrencyBRL(point.amount)})`;
}

export const InvestmentAllocationChart = memo(function InvestmentAllocationChart({ allocation }: Props) {
  if (allocation.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-[300px] flex items-center justify-center text-white/40 text-sm">
        Sem dados de alocacao
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-[300px]">
      <h3 className="text-white/90 text-sm font-semibold mb-3">Alocacao da Carteira</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocation}
              dataKey="percentage"
              nameKey="type"
              innerRadius={48}
              outerRadius={78}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {allocation.map((item, index) => (
                <Cell key={item.type} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={TOOLTIP_CONTENT_STYLE}
              formatter={formatTooltip}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-1.5 mt-2">
        {allocation.map((item, index) => (
          <div key={item.type} className="flex items-center justify-between text-xs">
            <span className="text-white/70 flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: COLORS[index % COLORS.length] }}
              />
              {item.type}
            </span>
            <span className="text-white">{item.percentage.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
});
