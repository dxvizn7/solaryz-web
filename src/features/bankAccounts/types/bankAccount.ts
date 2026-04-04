export interface PlanInfo {
  tier: 'Satelite' | 'Solar' | 'Galatico';
  features: {
    import_ofx: boolean;
    unlimited_accounts: boolean;
    unlimited_cards: boolean;
  };
  usage: {
    bank_accounts: {
      used: number;
      limit: number;
    };
    credit_cards: {
      used: number;
      limit: number;
    };
  };
}

export interface CreditCardTransaction {
  id: number;
  credit_card_id: number;
  description: string;
  amount: string;
  date: string;
  type: 'DEBIT' | 'CREDIT';
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

export interface CreditCard {
  id: number;
  bank_account_id: number;
  name: string;
  limit: string;
  closing_day: number;
  due_day: number;
  account_ending?: string;
  color: string;
  // Nested structure might have transactions but typically loaded via invoices
}

export interface BankAccount {
  id: number;
  user_id: number;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  bank_identifier: string; // The logo/bank code
  initial_balance: string; // From string payload
  current_balance?: string; 
  credit_cards?: CreditCard[];
}

export interface CreateBankAccountDTO {
  name: string;
  type: 'checking' | 'savings' | 'investment';
  bank_identifier: string;
  initial_balance: number;
}

export interface UploadInvoiceResponse {
  message: string;
  transactions_found: number;
}
