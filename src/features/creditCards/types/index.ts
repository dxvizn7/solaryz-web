export interface CreditCard {
  id: number;
  user_id: number;
  name: string;
  limit: string; // Vem como string no payload de exemplo
  closing_day: number;
  due_day: number;
  bank_identifier: string;
  account_ending?: string;
  color: string;
}

export interface CreditCardTransaction {
  id: number;
  credit_card_id: number;
  description: string;
  amount: string; // Valores em string geralmente vêm do backend Laravel, cuidaremos no parse
  date: string;
  category?: {
    name: string;
    color: string;
    icon?: string;
  };
  is_installment: boolean;
  installment_current?: number;
  installment_total?: number;
  total_purchase_amount?: string;
}

export interface InvoicePeriod {
  month: string; // Ex: '2023-07'
  label: string; // Ex: 'Julho'
  year: string;  // Ex: '2023'
}

export interface UploadInvoiceResponse {
  message: string;
  transactions_found: number;
}
