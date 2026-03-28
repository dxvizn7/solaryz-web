import { api } from '../../../config/api';

export interface Account {
  id: number;
  name: string;
  balance: number;
  currency_code: string;
  bank_logo: string;
  type: string;
}

export async function getAccounts(): Promise<Account[]> {
  const response = await api.get('accounts');
  return response.data;
}