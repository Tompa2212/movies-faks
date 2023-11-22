import NotFoundError from '../errors/not-found';
import { movieRepository } from '../repository/movie.repository';
import { Pagination } from '../types/Pagination';

const getTop250 = async (type: 'movie' | 'series') => {
  if (type === 'movie') {
    return await movieRepository.findTop250Movies();
  }

  return await movieRepository.findTop250Series();
};

const getTitleById = async (titleId: number, userId?: number) => {
  const title = await movieRepository.findById(titleId, userId);

  if (!title) {
    throw new NotFoundError({ description: `No title with id: ${titleId}` });
  }

  return title;
};

const searchByText = async (text: string, pagination: Pagination) => {
  return movieRepository.findBySearch(text, {
    offset: pagination.page * pagination.size,
    limit: pagination.size
  });
};

export const movieService = {
  getTop250,
  getTitleById,
  searchByText
};
