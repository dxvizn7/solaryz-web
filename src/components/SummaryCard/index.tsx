import type { ReactNode } from 'react';
import { Wallet } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon?: ReactNode;
}

export function SummaryCard({ title, value, subtitle, icon }: SummaryCardProps) {
  const formattedValue = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3 w-full max-w-sm">
      <div className="flex items-center gap-2 text-solar-orange font-medium text-sm">
        {icon || <Wallet size={20} />}
        <span className="text-gray-600">{title}</span>
      </div>
      <span className="text-3xl font-bold text-gray-800">{formattedValue}</span>
      <span className="text-xs text-gray-400">{subtitle}</span>
    </div>
  );
}