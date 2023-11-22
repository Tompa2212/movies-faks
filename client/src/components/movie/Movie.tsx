import { MovieDto } from '@/types/dto-types/MovieDto';
import React from 'react';

import MovieHeader from './MovieHeader';
import MovieContent from './MovieContent';

const Movie = ({ movie }: { movie: MovieDto }) => {
  return (
    <>
      <MovieHeader movie={movie} />
      <MovieContent movie={movie} />
    </>
  );
};

export default Movie;
