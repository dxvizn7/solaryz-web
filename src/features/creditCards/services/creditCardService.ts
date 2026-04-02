import { api } from '../../../config/api';
import type { CreditCard, CreditCardTransaction, UploadInvoiceResponse } from '../types';

export const creditCardService = {
  async getCreditCards(): Promise<CreditCard[]> {
    const { data } = await api.get<CreditCard[]>('/credit-cards');
    return data;
  },

  async createCreditCard(card: Omit<CreditCard, 'id' | 'user_id'>): Promise<CreditCard> {
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
  },

  // Rota fictícia assumindo que o endpoint para pegar transações por fatura existe na sua controller de faturas
  // Se ele usa a rota `/transactions` filtrando por card_id e date, ajuste aqui.
  async getTransactionsByInvoice(cardId: number, month: string, year: string): Promise<CreditCardTransaction[]> {
    // Aqui estou mandando via Query params `?card_id=x&month=y&year=z`, ajuste de acordo com o backend
    const { data } = await api.get<CreditCardTransaction[]>('/transactions', {
      params: { 
        credit_card_id: cardId,
        month,
        year
      }
    });
    return data;
  }
};
