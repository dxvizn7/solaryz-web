export const formatCurrencyBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export const formatPercent = (value: number) => `${value.toFixed(2)}%`;

export const formatMonthLabel = (month: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: '2-digit',
  }).format(new Date(month));
