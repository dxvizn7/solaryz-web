import { api } from '../../../config/api';
import type { CategoryExpense } from '../types';

export const categoryService = {
  async getExpenses(): Promise<CategoryExpense[]> {
    const response = await api.get('/solaryz/categories/expenses'); 
    return response.data.data;
  }
};