import { useQuery } from '@tanstack/react-query';
import { getInvestmentsDividends, getInvestmentsPerformance } from '../services/investmentsAnalyticsService';

export function useInvestmentsAnalytics(months = 6, withBenchmark = true) {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ['investments-analytics', months, withBenchmark],
    queryFn: async () => {
      const [performance, dividends] = await Promise.all([
        getInvestmentsPerformance(months, withBenchmark),
        getInvestmentsDividends(months),
      ]);

      return { performance, dividends };
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  return {
    performance: data?.performance,
    dividends: data?.dividends,
    isLoading,
    isRefetching,
    error: error ? 'Erro ao carregar analytics de investimentos.' : null,
    refetch,
  };
}
