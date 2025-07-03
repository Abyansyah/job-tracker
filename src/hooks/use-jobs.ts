import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useJobs() {
  const { data, error, mutate } = useSWR('/api/jobs', fetcher);

  return {
    jobs: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
