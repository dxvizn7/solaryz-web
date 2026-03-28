import { useQuery } from '@tanstack/react-query';
import { api } from '../../../config/api';

interface TransactionSummary {
  income: number;
  expense: number;
  total: number;
}

export function useTransactionSummary() {
  const { 
    data: summary = { income: 0, expense: 0, total: 0 }, 
    isLoading, 
    isRefetching, 
    refetch 
  } = useQuery({
    queryKey: ['transactionSummary'],
    queryFn: async () => {
      const response = await api.get('transactions/summary');
      return response.data as TransactionSummary;
    },
    refetchInterval: 30000, // Atualiza sozinho a cada 30s
    staleTime: 10000,
  });

  return { summary, isLoading, isRefetching, refetch };
}