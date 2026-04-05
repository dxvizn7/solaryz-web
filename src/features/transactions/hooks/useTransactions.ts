import { useQuery } from '@tanstack/react-query';
import { api } from '../../../config/api';

export interface Transaction {
  id: number;
  account_id: number | null;
  user_id: number;
  credit_card_id: number | null;
  parent_id: number | null;
  pluggy_transaction_id: string | null;
  description: string;
  amount: number;
  currency_code: string;
  date: string;
  category_id: number | null;
  type: 'CREDIT' | 'DEBIT';
  status: string;
  source: string | null;
  is_installment: boolean;
  installment_current: number | null;
  installment_total: number | null;
  total_purchase_amount: number | null;
  invoice_date: string | null;
  // Joined fields that may come from the backend
  category_name?: string;
  account_name?: string;
  credit_card_name?: string;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  month?: number;
  year?: number;
  type?: 'CREDIT' | 'DEBIT' | '';
  page?: number;
  per_page?: number;
}

export interface TransactionPaginatedResponse {
  data: Transaction[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export function useTransactions(filters: TransactionFilters = {}) {
  const { start_date, end_date, type, page = 1, per_page = 20 } = filters;

  const params: Record<string, string | number> = { page, per_page };
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (type) params.type = type;

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const response = await api.get<TransactionPaginatedResponse | Transaction[]>('transactions', { params });
      // Handle both paginated and plain array responses
      const raw = response.data;
      if (Array.isArray(raw)) {
        return { data: raw, total: raw.length, current_page: 1, last_page: 1, per_page: raw.length };
      }
      return raw as TransactionPaginatedResponse;
    },
    staleTime: 15000,
    placeholderData: (prev) => prev,
  });

  return {
    transactions: data?.data ?? [],
    total: data?.total ?? 0,
    currentPage: data?.current_page ?? 1,
    lastPage: data?.last_page ?? 1,
    isLoading,
    isRefetching,
    refetch,
  };
}
