import { api } from '../../../config/api';

export interface Account {
  id: number;
  name: string;
  balance: number;
  currency_code: string;
  bank_logo: string;
  bank_identifier?: string;
  type: string;
  current_balance?: string;
  initial_balance?: string;
  credit_cards?: any[];
}

export async function getAccounts(): Promise<Account[]> {
  const response = await api.get('bank-accounts');
  // Normaliza os campos do backend para os esperados pelo frontend
  return response.data.map((acc: any) => ({
    ...acc,
    balance: Number(acc.balance ?? acc.current_balance ?? acc.initial_balance ?? 0),
    bank_logo: acc.bank_logo || acc.bank_identifier || '',
    currency_code: acc.currency_code || 'BRL',
  }));
}