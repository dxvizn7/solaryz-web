import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  Calendar,
  Receipt,
  CreditCard,
  Landmark,
} from 'lucide-react';
import { Layout } from '../../../components/Layout';
import { useTransactions } from '../hooks/useTransactions';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(val: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Returns { yearMonth: "YYYY-MM", label } for a month offset from today */
function monthInfo(offset = 0) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return { yearMonth, label };
}

/**
 * Returns the year-month string "YYYY-MM" that determines which month
 * a transaction belongs to, for display and filtering purposes.
 *
 * Priority:
 *   1. invoice_date  — set by the backend based on the card's closing_day
 *      (e.g. Uber on Apr 01 with closing_day=5 gets invoice_date=2026-03-01)
 *   2. date          — fallback for bank-account transactions or legacy data
 *      that was imported before invoice_date was introduced
 */
function effectiveYearMonth(tx: { date: string; invoice_date?: string | null }) {
  const raw = tx.invoice_date ?? tx.date;
  return raw?.slice(0, 7) ?? '';
}

// ─── source badge ─────────────────────────────────────────────────────────────

function SourceBadge({ creditCardName, accountName, source }: {
  creditCardName?: string;
  accountName?: string;
  source?: string | null;
}) {
  if (creditCardName) {
    return (
      <span className="flex items-center gap-1 text-[11px] text-white/50">
        <CreditCard size={11} /> {creditCardName}
      </span>
    );
  }
  if (accountName) {
    return (
      <span className="flex items-center gap-1 text-[11px] text-white/50">
        <Landmark size={11} /> {accountName}
      </span>
    );
  }
  if (source) return <span className="text-[11px] text-white/40">{source}</span>;
  return null;
}

// ─── skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <td key={i} className="px-4 py-4">
          <div className="h-3 bg-white/10 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ─── constants ────────────────────────────────────────────────────────────────

const PER_PAGE = 25;

// ─── main page ────────────────────────────────────────────────────────────────

export function TransactionsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [monthOffset, setMonthOffset] = useState(0);
  const [typeFilter, setTypeFilter] = useState<'CREDIT' | 'DEBIT' | ''>('');
  const [page, setPage] = useState(1);

  const { yearMonth, label } = useMemo(() => monthInfo(monthOffset), [monthOffset]);

  // Fetch ALL transactions (no server-side date filter yet — API may not support it uniformly).
  // Once the backend sets invoice_date consistently, we can switch to server-side month filtering.
  const { transactions: allTransactions, isLoading, isRefetching, refetch } = useTransactions({
    month: Number(yearMonth.split('-')[1]),
    year: Number(yearMonth.split('-')[0]),
    per_page: 500,
  });

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allTransactions.filter(tx => {
      // Date: for installments use invoice_date; for everything else use date
      if (effectiveYearMonth(tx) !== yearMonth) return false;
      // Type filter
      if (typeFilter && tx.type !== typeFilter) return false;
      return true;
    });
  }, [allTransactions, yearMonth, typeFilter]);

  // Reset to page 1 whenever the filtered set changes
  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PER_PAGE)));

  // ── Client-side pagination ─────────────────────────────────────────────────
  const paginatedTx = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, safePage]);

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  // ── Month summaries (from fully filtered set, not just current page) ───────
  const filteredIncome = useMemo(
    () => filtered.filter(t => t.type === 'CREDIT').reduce((s, t) => s + Number(t.amount), 0),
    [filtered]
  );
  const filteredExpense = useMemo(
    () => filtered.filter(t => t.type === 'DEBIT').reduce((s, t) => s + Number(t.amount), 0),
    [filtered]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleMonthChange = (delta: number) => {
    setMonthOffset(p => p + delta);
    setPage(1);
  };
  const handleTypeChange = (t: 'CREDIT' | 'DEBIT' | '') => {
    setTypeFilter(t);
    setPage(1);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <ArrowRightLeft className="text-[#F2910A]" size={30} />
              Transações
            </h1>
            <p className="text-white/50 mt-1 text-sm font-medium">
              Histórico completo de entradas e saídas. Parcelas distribuídas pelo mês da fatura.
            </p>
          </div>

          <button
            onClick={() => {
              refetch();
              queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
            }}
            disabled={isRefetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={15} className={isRefetching ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        {/* ── Month navigator + type filter ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Month navigator — no restriction on future months */}
          <div className="flex items-center gap-2 bg-[#1C1C21] border border-white/10 rounded-xl px-3 py-2 flex-1 sm:flex-none">
            <button
              onClick={() => handleMonthChange(-1)}
              className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="flex items-center gap-2 text-white font-medium text-sm min-w-[180px] justify-center capitalize">
              <Calendar size={14} className="text-[#F2910A]" />
              {label}
            </span>
            <button
              onClick={() => handleMonthChange(1)}
              className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Type filter pills */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-white/40" />
            {(['', 'CREDIT', 'DEBIT'] as const).map(t => (
              <button
                key={t || 'ALL'}
                onClick={() => handleTypeChange(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  typeFilter === t
                    ? t === 'CREDIT'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                      : t === 'DEBIT'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-[#F2910A]/20 text-[#F2910A] border border-[#F2910A]/40'
                    : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white'
                }`}
              >
                {t === '' ? 'Todos' : t === 'CREDIT' ? 'Entradas' : 'Saídas'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Summary chips (based on full filtered set for this month) ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Transações no mês',
              value: filtered.length,
              icon: Receipt,
              color: 'text-white/70',
              bg: 'bg-white/5',
              isCount: true,
            },
            {
              label: 'Entradas no mês',
              value: filteredIncome,
              icon: TrendingUp,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
              isCount: false,
            },
            {
              label: 'Saídas no mês',
              value: filteredExpense,
              icon: TrendingDown,
              color: 'text-red-400',
              bg: 'bg-red-500/10',
              isCount: false,
            },
          ].map(({ label, value, icon: Icon, color, bg, isCount }) => (
            <div key={label} className={`${bg} border border-white/5 rounded-2xl p-4 flex items-center gap-3`}>
              <div className={`${color} bg-white/5 p-2 rounded-xl`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs text-white/40 mb-0.5">{label}</p>
                <p className={`text-lg font-bold ${color}`}>
                  {isCount ? value : formatCurrency(value)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="bg-[#1C1C21] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  <th className="px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Descrição</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Origem</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                  : paginatedTx.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-white/30">
                          <Receipt size={36} className="opacity-50" />
                          <p className="font-medium">Nenhuma transação neste mês</p>
                          <p className="text-xs">
                            {isLoading
                              ? 'Carregando...'
                              : 'Navegue por outro mês ou importe um extrato OFX.'}
                          </p>
                          <button
                            onClick={() => navigate('/bank-accounts')}
                            className="mt-2 px-5 py-2 rounded-xl bg-[#F2910A]/10 text-[#F2910A] text-sm font-semibold hover:bg-[#F2910A]/20 transition-colors"
                          >
                            Ir para Contas e Cartões
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                  : paginatedTx.map(tx => (
                    <tr
                      key={tx.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Date — show invoice_date for installments, else date */}
                      <td className="px-4 py-3 text-white/60 whitespace-nowrap text-xs">
                        {formatDate(
                          (tx.is_installment && tx.invoice_date) ? tx.invoice_date : tx.date
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white font-medium leading-tight">{tx.description}</span>
                          {tx.is_installment && tx.installment_total && (
                            <span className="text-[10px] text-[#F2910A]/70">
                              Parcela {tx.installment_current}/{tx.installment_total}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3">
                        <SourceBadge
                          creditCardName={tx.credit_card_name}
                          accountName={tx.account_name}
                          source={tx.source}
                        />
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        {tx.category_name ? (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/60 text-[11px]">
                            {tx.category_name}
                          </span>
                        ) : (
                          <span className="text-white/20 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className={`px-4 py-3 text-right font-bold whitespace-nowrap ${
                        tx.type === 'CREDIT' ? 'text-green-400' : 'text-white/80'
                      }`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {lastPage > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/[0.02]">
              <span className="text-xs text-white/40">
                Página{' '}
                <span className="text-white font-medium">{safePage}</span>
                {' '}de{' '}
                <span className="text-white font-medium">{lastPage}</span>
                {' '}·{' '}
                <span className="text-white font-medium">{filtered.length}</span> transações
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(lastPage - 4, safePage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        pageNum === safePage
                          ? 'bg-[#F2910A] text-white shadow-lg shadow-[#F2910A]/20'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                  disabled={safePage >= lastPage}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
