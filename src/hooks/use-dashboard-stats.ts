import { fetcher } from '@/lib/utils';
import useSWR from 'swr';

export function useDashboardStats() {
  const { data, error, mutate } = useSWR('/api/dashboard/stats', fetcher);

  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
