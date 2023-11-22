import { MovieListDTO } from '@/types/Movie';
import api from '@/lib/create-fetcher';

export async function getTop250Movies() {
  const { data } = await api.get('movies/top-250');

  return data as MovieListDTO[];
}

export async function getTop250TvShows() {
  const { data } = await api.get('movies/top-250?type=series');

  return data as MovieListDTO[];
}
