import { useQuery } from '@tanstack/react-query';
import { getMonthlyCashFlow } from '../services/dashboardService';

export function useMonthlyCashFlow() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'monthly-cashflow'],
    queryFn: getMonthlyCashFlow,
    staleTime: 60000,
  });

  return {
    cashFlow: data,
    isLoading,
    isError,
  };
}
