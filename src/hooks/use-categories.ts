import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
