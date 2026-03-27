import { useQuery } from '@tanstack/react-query';
import { getHeatmap } from '../services/dashboardService';

export function useHeatmap() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'heatmap'],
    queryFn: getHeatmap,
    staleTime: 60000,
  });

  return {
    heatmap: data,
    isLoading,
    isError,
  };
}
