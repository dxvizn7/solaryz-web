import { AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import { useCategoryExpenses } from '../../hooks/useCategoryExpenses';
import type { CategoryExpense, AlertLevel } from '../../types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

// Maps alert level to bar color
function getBarColor(alertLevel: AlertLevel, hasBudget: boolean): string {
  if (!hasBudget) return 'bg-gray-500';
  if (alertLevel === 'critical') return 'bg-red-500';
  if (alertLevel === 'warning') return 'bg-yellow-400';
  return 'bg-solar-orange';
}

function AlertIcon({ level }: { level: AlertLevel }) {
  if (level === 'critical')
    return <XCircle size={14} className="text-red-400 shrink-0" />;
  if (level === 'warning')
    return <AlertTriangle size={14} className="text-yellow-400 shrink-0" />;
  return null;
}

function CategoryRow({ item }: { item: CategoryExpense }) {
  const hasBudget = item.budget > 0;
  const barWidth = hasBudget ? Math.min(item.percentage, 100) : 0;
  const barColor = getBarColor(item.alert_level, hasBudget);

  return (
    <div className="group py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <AlertIcon level={item.alert_level} />
          <span className="text-white/90 text-sm font-medium">{item.name}</span>
        </div>
        <div className="text-right">
          <span className="text-white text-sm font-semibold">
            {formatCurrency(item.spent)}
          </span>
          {hasBudget && (
            <span className="text-white/40 text-xs ml-1">
              / {formatCurrency(item.budget)}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        {hasBudget ? (
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${barWidth}%` }}
          />
        ) : (
          <div className="h-full w-full bg-white/5 rounded-full" />
        )}
      </div>

      {hasBudget && (
        <div className="flex justify-between mt-1">
          <span
            className={`text-xs font-medium ${
              item.alert_level === 'critical'
                ? 'text-red-400'
                : item.alert_level === 'warning'
                ? 'text-yellow-400'
                : 'text-white/40'
            }`}
          >
            {item.percentage.toFixed(0)}% do limite
          </span>
          {item.alert_level === 'critical' && (
            <span className="text-xs text-red-400 font-medium">Limite atingido</span>
          )}
          {item.alert_level === 'warning' && (
            <span className="text-xs text-yellow-400 font-medium">Atenção</span>
          )}
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="py-3 border-b border-white/5 last:border-0 animate-pulse">
      <div className="flex justify-between mb-2">
        <div className="h-3.5 w-24 bg-white/10 rounded" />
        <div className="h-3.5 w-20 bg-white/10 rounded" />
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full" />
    </div>
  );
}

interface Props {
  onManageBudgets?: () => void;
}

export function CategoryExpenseList({ onManageBudgets }: Props) {
  const { expenses, totalSpent, isLoading, error } = useCategoryExpenses();

  const hasAlerts = expenses.some(
    (e) => e.alert_level === 'warning' || e.alert_level === 'critical'
  );

  return (
    <div className="bg-[#1e1e1e] rounded-2xl p-5 w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white font-semibold text-base">Despesas do Mês</h2>
        <div className="flex items-center gap-2">
          {hasAlerts && (
            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded-full">
              <AlertTriangle size={11} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-medium">Alerta</span>
            </div>
          )}
          <span className="text-solar-orange font-bold text-sm">
            {formatCurrency(totalSpent)}
          </span>
        </div>
      </div>

      <p className="text-white/40 text-xs mb-4">Agrupado por categoria</p>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
        {error ? (
          <p className="text-red-400 text-sm text-center py-6">{error}</p>
        ) : isLoading ? (
          <>
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </>
        ) : expenses.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-8">
            Nenhuma transação encontrada neste mês.
          </p>
        ) : (
          expenses.map((item) => (
            <CategoryRow key={item.category_id} item={item} />
          ))
        )}
      </div>

      {/* Footer — gerenciar limites */}
      <button
        onClick={onManageBudgets}
        className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white/90 text-sm font-medium"
      >
        Gerenciar limites
        <ChevronRight size={14} />
      </button>
    </div>
  );
}