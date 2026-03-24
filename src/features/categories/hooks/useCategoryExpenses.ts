import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

export function useCategoryExpenses() {
  const { 
    data: expenses = [], 
    isLoading, 
    isRefetching, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['categoryExpenses'],
    queryFn: () => categoryService.getExpenses(),
    refetchInterval: 30000, // Atualização automática a cada 30s
    staleTime: 10000,
  });

  const totalSpent = expenses.reduce((acc, e) => acc + e.spent, 0);

  return { 
    expenses, 
    totalSpent, 
    isLoading, 
    isRefetching, 
    error: error ? 'Erro ao carregar categorias' : null, 
    refetch 
  };
}