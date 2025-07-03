import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardStats() {
  const { data, error, mutate } = useSWR('/api/dashboard/stats', fetcher);

  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
