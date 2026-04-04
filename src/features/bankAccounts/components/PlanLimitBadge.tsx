import type { PlanInfo } from '../types/bankAccount';
import { AlertCircle, Crown, Info } from 'lucide-react';

interface PlanLimitBadgeProps {
  planInfo: PlanInfo;
  type: 'bank_accounts' | 'credit_cards';
}

export function PlanLimitBadge({ planInfo, type }: PlanLimitBadgeProps) {
  const usage = planInfo?.usage?.[type] || { used: 0, limit: 999 };
  const isSatelite = planInfo?.tier === 'Satelite';
  const isAtLimit = usage.used >= usage.limit && isSatelite;

  if (!isSatelite) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F2910A]/20 to-[#F2910A]/10 border border-[#F2910A]/30 text-xs font-medium text-white">
        <Crown size={14} className="text-[#F2910A]" />
        <span>Plano {planInfo.tier}</span>
        <span className="text-white/40 ml-1">Ilmo.</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
      isAtLimit 
        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
        : 'bg-white/5 border-white/10 text-white/60'
    }`}>
      {isAtLimit ? <AlertCircle size={14} /> : <Info size={14} />}
      <span>
        Plano Satélite: {usage.used} / {usage.limit} {type === 'bank_accounts' ? 'contas' : 'cartões'}
      </span>
    </div>
  );
}
