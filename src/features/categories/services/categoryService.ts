import { api } from '../../../config/api';
import type { Category, CategoryExpense } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get('categories');
    return response.data.data;
  },

  async getExpenses(): Promise<CategoryExpense[]> {
    const response = await api.get('categories/expenses');
    return response.data.data;
  },

  async create(name: string, color: string): Promise<Category> {
    const response = await api.post('categories', { name, color });
    return response.data.data;
  },

  async update(id: number, data: { name?: string; color?: string }): Promise<Category> {
    const response = await api.put(`categories/${id}`, data);
    return response.data.data;
  },

  async toggleActive(id: number): Promise<Category> {
    const response = await api.patch(`categories/${id}/toggle`);
    return response.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`categories/${id}`);
  },
};