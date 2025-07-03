import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface JobFilters {
  searchTerm: string;
  location: string;
  status: string;
  source: string;
}

export function useJobs(filters: JobFilters) {
  const params = new URLSearchParams();
  if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
  if (filters.location) params.append('location', filters.location);
  if (filters.status) params.append('status', filters.status);
  if (filters.source) params.append('source', filters.source);

  const queryString = params.toString();
  const url = `/api/jobs${queryString ? `?${queryString}` : ''}`;

  const { data, error, mutate } = useSWR(url, fetcher);

  return {
    jobs: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
