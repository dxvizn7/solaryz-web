import { useQuery } from '@tanstack/react-query';
import { getInvestments, getInvestmentsTotal } from '../services/investmentsService';

export function useInvestments() {
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      // Faz as duas buscas em paralelo e retorna um objeto com tudo
      const [investmentsData, total] = await Promise.all([getInvestments(), getInvestmentsTotal()]);
      return { investments: investmentsData, totalInvested: total };
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  return { 
    investments: data?.investments || [], 
    totalInvested: data?.totalInvested || 0, 
    isLoading, 
    isRefetching, 
    refetch 
  };
}