'use server';
import api from '@/lib/create-fetcher';

export const removeMovie = async (watchlistId: number, movieId: number) => {
  await api.delete(`/watchlists/${watchlistId}/movies/${movieId}`);
};
