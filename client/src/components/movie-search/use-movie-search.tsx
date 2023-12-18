'use client';
import { useApi } from '@/hooks/use-api';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { Movie } from '@/types/Movie';
import { useQuery } from '@tanstack/react-query';

export const useMovieSearch = (search: string) => {
  const api = useApi();
  const debouncedValue = useDebouncedValue(search, 300);

  const getMovies = async () => {
    if (search) {
      const { data } = await api.get(`/movies?title=${search}`);
      return data;
    }

    return [];
  };

  const {
    data: movies,
    isFetched,
    isFetching
  } = useQuery<Movie[]>({
    queryKey: ['movies-search', debouncedValue],
    queryFn: async () => await getMovies(),
    initialData: []
  });

  return { movies, isFetched, isFetching, search };
};
