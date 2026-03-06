import { api } from '../../../config/api';

export interface Investment {
  id: number;
  name: string;
  type: string | null;
  subtype: string | null;
  balance: number;
  currency_code: string;
  amount_profit: number | null;
  amount_original: number | null;
  annual_rate: number | null;
  status: string | null;
  institution: string | null;
  due_date: string | null;
}

export async function getInvestments(): Promise<Investment[]> {
  const response = await api.get('/investments');
  return response.data;
}

export async function getInvestmentsTotal(): Promise<number> {
  const response = await api.get('/investments/total');
  return response.data.total;
}