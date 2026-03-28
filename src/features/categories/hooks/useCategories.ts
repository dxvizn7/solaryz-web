import { useState, useEffect, useCallback } from 'react';
import type { Category } from '../types';
import { categoryService } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch {
      setError('Erro ao carregar categorias.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (name: string, color: string) => {
    const created = await categoryService.create(name, color);
    setCategories((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCategory = useCallback(async (id: number, data: { name?: string; color?: string }) => {
    const updated = await categoryService.update(id, data);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const toggleActive = useCallback(async (id: number) => {
    const updated = await categoryService.toggleActive(id);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const removeCategory = useCallback(async (id: number) => {
    await categoryService.remove(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    categories,
    isLoading,
    error,
    refresh: fetchCategories,
    createCategory,
    updateCategory,
    toggleActive,
    removeCategory,
  };
}
