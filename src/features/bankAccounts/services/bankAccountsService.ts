import { api } from '../../../config/api';
import type { BankAccount, PlanInfo, CreateBankAccountDTO, CreditCard, UploadInvoiceResponse } from '../types/bankAccount';

export interface CreateCreditCardDTO {
  bank_account_id: number;
  name: string;
  limit: number;
  closing_day: number;
  due_day: number;
  account_ending?: string;
  color: string;
}

export const bankAccountsService = {
  async getAccounts(): Promise<BankAccount[]> {
    const { data } = await api.get<BankAccount[]>('/bank-accounts');
    return data;
  },

  async createAccount(account: CreateBankAccountDTO): Promise<BankAccount> {
    const { data } = await api.post<BankAccount>('/bank-accounts', account);
    return data;
  },

  async deleteAccount(id: number): Promise<void> {
    await api.delete(`/bank-accounts/${id}`);
  },

  async getPlanInfo(): Promise<PlanInfo> {
    const { data } = await api.get<PlanInfo>('/plan');
    return data;
  },

  // Credit Card operations nested under Bank Accounts concept
  async createCreditCard(card: CreateCreditCardDTO): Promise<CreditCard> {
    const { data } = await api.post<CreditCard>('/credit-cards', card);
    return data;
  },

  async deleteCreditCard(id: number): Promise<void> {
    await api.delete(`/credit-cards/${id}`);
  },

  async uploadInvoice(cardId: number, file: File): Promise<UploadInvoiceResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post<UploadInvoiceResponse>(
      `/credit-cards/${cardId}/import`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  }
};
