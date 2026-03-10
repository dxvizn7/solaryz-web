import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import type { CategoryExpense } from '../types';

export function useCategoryExpenses() {
  const [expenses, setExpenses] = useState<CategoryExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalSpent = expenses.reduce((acc, e) => acc + e.spent, 0);

  async function fetchExpenses() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoryService.getExpenses();
      setExpenses(data);
    } catch {
      setError('Erro ao carregar gastos por categoria.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, totalSpent, isLoading, error, refetch: fetchExpenses };
}