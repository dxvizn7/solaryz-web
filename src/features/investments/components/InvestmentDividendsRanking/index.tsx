import type { DividendsByAssetPoint } from '../../types/analytics';
import { formatCurrencyBRL } from '../../utils/formatters';

type Props = {
  byAsset: DividendsByAssetPoint[];
};

export function InvestmentDividendsRanking({ byAsset }: Props) {
  if (byAsset.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-white/40 text-sm">
        Sem ativos com proventos no periodo
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h3 className="text-white/90 text-sm font-semibold mb-3">Ranking de Dividendos</h3>
      <div className="flex flex-col">
        {byAsset.slice(0, 6).map((item) => (
          <div
            key={`${item.asset}-${item.total}`}
            className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
          >
            <span className="text-white/80 text-sm">{item.asset || 'N/A'}</span>
            <span className="text-white text-sm font-semibold">{formatCurrencyBRL(item.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
