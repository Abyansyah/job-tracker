import { fetcher } from '@/lib/utils';
import useSWR from 'swr';

export function useCategories(type: 'locations' | 'statuses' | 'sources') {
  const { data, error, mutate } = useSWR(`/api/categories/${type}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
