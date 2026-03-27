import { api } from '../../../config/api';

export interface HeatmapDataPoint {
  date: string;
  incomeCount: number;
  incomeVolume: number;
  expenseCount: number;
  expenseVolume: number;
}

export interface HeatmapResponse {
  year: number;
  data: HeatmapDataPoint[];
}

export interface MonthlyCashFlowPoint {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlyCashFlowResponse {
  period: string;
  data: MonthlyCashFlowPoint[];
}

export async function getHeatmap(): Promise<HeatmapResponse> {
  const response = await api.get('/transactions/heatmap');
  return response.data;
}

export async function getMonthlyCashFlow(): Promise<MonthlyCashFlowResponse> {
  const response = await api.get('/transactions/monthly-cashflow');
  return response.data;
}
