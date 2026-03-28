import { api } from '../../../config/api';
import type { DividendsResponse, PerformanceResponse } from '../types/analytics';

export async function getInvestmentsPerformance(
  months = 6,
  withBenchmark = true,
): Promise<PerformanceResponse> {
  const response = await api.get('investments/performance', {
    params: { months, withBenchmark },
  });

  return response.data;
}

export async function getInvestmentsDividends(months = 6): Promise<DividendsResponse> {
  // Mudança na string da rota abaixo: de 'api/investments/dividends' para '/investments/dividends'
  const response = await api.get('investments/dividends', {
    params: { months },
  });

  return response.data;
}