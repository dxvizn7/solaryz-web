// src/features/accounts/hooks/useAccounts.ts
import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '../services/accountsService';

export function useAccounts() {
  const { 
    data: accounts = [], // Se for undefined, inicia como array vazio
    isLoading, 
    isRefetching, // True quando estiver atualizando em background ou via botão
    refetch 
  } = useQuery({
    queryKey: ['accounts'], // Chave única para o cache
    queryFn: getAccounts,
    refetchInterval: 30000, // Aqui está o Polling automático: atualiza a cada 30 segundos!
    staleTime: 10000, // Os dados ficam "frescos" por 10s antes de precisar buscar de novo ao trocar de tela
  });

  const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0);

  return { 
    accounts, 
    totalBalance, 
    isLoading, 
    isRefetching, 
    refetch 
  };
}