import api from '@/lib/create-fetcher';
import { MovieDto } from '@/types/dto-types/MovieDto';
import { AxiosError } from 'axios';
import { cache } from 'react';

export const getMovie = cache(async (id: string) => {
  try {
    const { data: movie } = await api.get(`/movies/${id}`);

    return movie as MovieDto;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.description);
    }

    throw new Error('Movie not found.');
  }
});
