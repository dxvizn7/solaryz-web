import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../config/api';

interface TransactionSummary {
  income: number;
  expense: number;
}

export function useTransactionSummary() {
  const [summary, setSummary] = useState<TransactionSummary>({ income: 0, expense: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await api.get('/transactions/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Erro ao buscar resumo de transações:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, isLoading };
}