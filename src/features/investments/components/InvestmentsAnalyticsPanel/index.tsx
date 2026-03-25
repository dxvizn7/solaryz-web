import { useInvestmentsAnalytics } from '../../hooks/useInvestmentsAnalytics';
import { InvestmentPerformanceChart } from '../InvestmentPerformanceChart';
import { InvestmentAllocationChart } from '../InvestmentAllocationChart';
import { InvestmentDividendsChart } from '../InvestmentDividendsChart';
import { InvestmentDividendsRanking } from '../InvestmentDividendsRanking';

export function InvestmentsAnalyticsPanel() {
  const { performance, dividends, isLoading, error } = useInvestmentsAnalytics(6, true);

  if (error) {
    return (
      <div className="w-full mt-4 bg-white/5 border border-red-500/30 rounded-2xl h-64 flex items-center justify-center text-red-300 text-sm">
        {error}
      </div>
    );
  }

  if (isLoading || !performance || !dividends) {
    return (
      <div className="w-full mt-4 bg-white/5 border border-white/10 rounded-2xl h-64 flex items-center justify-center text-white/40 text-sm animate-pulse">
        Carregando analytics de investimentos...
      </div>
    );
  }

  return (
    <div className="w-full mt-4 flex flex-col gap-4">
      <InvestmentPerformanceChart
        series={performance.series}
        benchmark={performance.benchmark ?? []}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1">
          <InvestmentAllocationChart allocation={performance.allocation ?? []} />
        </div>
        <div className="xl:col-span-1">
          <InvestmentDividendsChart monthly={dividends.monthly ?? []} />
        </div>
        <div className="xl:col-span-1">
          <InvestmentDividendsRanking byAsset={dividends.by_asset ?? []} />
        </div>
      </div>
    </div>
  );
}
