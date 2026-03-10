import { api } from '../../../config/api';
import type { CategoryExpense, CategoryBudget } from '../types';

export const categoryService = {
  async getExpenses(): Promise<CategoryExpense[]> {
    const { data } = await api.get('/solaryz/categories/expenses');
    return data.data;
  },

  async getBudgets(): Promise<CategoryBudget[]> {
    const { data } = await api.get('/solaryz/categories/budget');
    return data.data;
  },

  async upsertBudget(payload: {
    category_name: string;
    budget_limit: number;
    alert_threshold: number;
  }): Promise<CategoryBudget> {
    const { data } = await api.post('/solaryz/categories/budget', payload);
    return data.data;
  },

  async updateBudget(
    id: string,
    payload: { budget_limit: number; alert_threshold: number }
  ): Promise<CategoryBudget> {
    const { data } = await api.put(`/solaryz/categories/budget/${id}`, payload);
    return data.data;
  },

  async deleteBudget(id: string): Promise<void> {
    await api.delete(`/solaryz/categories/budget/${id}`);
  },
};