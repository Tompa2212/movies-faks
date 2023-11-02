import { movieRepository } from '../repository/movie.repository';

const getTop250 = async (type: 'movie' | 'series') => {
  if (type === 'movie') {
    return await movieRepository.findTop250Movies();
  }

  return await movieRepository.findTop250Series();
};

export const movieService = {
  getTop250
};
