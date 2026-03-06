import { useState, useEffect, useCallback } from 'react';
import { getInvestments, getInvestmentsTotal, type Investment } from '../services/investmentsService';

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvestments = useCallback(async () => {
    try {
      const [data, total] = await Promise.all([getInvestments(), getInvestmentsTotal()]);
      setInvestments(data);
      setTotalInvested(total);
    } catch (error) {
      console.error("Erro ao buscar investimentos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return { investments, totalInvested, isLoading, refetch: fetchInvestments };
}