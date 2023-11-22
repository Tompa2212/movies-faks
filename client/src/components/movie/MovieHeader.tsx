import React from 'react';
import Icon from '../ui/Icons';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import { MovieDto } from '@/types/dto-types/MovieDto';
import { getYearFromDate } from '@/utils/get-year-from-date';
import { createVotesLabel } from '@/utils/create-votes-label';
import RateMovieAction from './rate-movie-action/RateMovieAction';

const MovieHeader = ({ movie }: { movie: MovieDto }) => {
  const userRated = movie.userRating !== null;

  return (
    <header className="flex flex-wrap justify-between gap-6 mb-6">
      <div>
        <h1 className="text-3xl">{movie.title}</h1>
        <ul className="flex gap-6 text-gray-500" role="list">
          <li>{movie.type === 'series' ? 'TV Series' : 'Movie'}</li>
          {movie.released ? (
            <li className="list-disc">{getYearFromDate(movie.released)}</li>
          ) : null}
        </ul>
      </div>
      <div className="flex flex-wrap gap-6">
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-500 uppercase">
            Movies rating
          </p>
          <Button variant="ghost" className="flex items-center gap-2">
            <Icon
              name="Star"
              className="w-6 h-6 fill-yellow-400 stroke-yellow-400"
            />
            <div className="text-left">
              <p className="text-base leading-none">
                <span className="font-semibold">{movie.rating}</span> / 10
              </p>
            </div>
          </Button>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-500 uppercase">
            Total ratings
          </p>
          <p className="w-full py-2 text-center text-gray-500">
            {createVotesLabel(movie.votes)}
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-500 uppercase ">
            Your RATING
          </p>
          <RateMovieAction
            movieId={movie.id}
            userRating={movie.userRating}
            className="flex items-center gap-2 text-blue-500 group"
          >
            <Icon
              name="Star"
              className={clsx(
                'w-6 h-6 transition-colors stroke-blue-500 group-hover:fill-blue-500',
                userRated && 'fill-blue-500'
              )}
            />
            <p>
              {userRated ? (
                <>
                  <span className="font-semibold">
                    {movie.userRating.rating}
                  </span>{' '}
                  / 10
                </>
              ) : (
                'Rate'
              )}
            </p>
          </RateMovieAction>
        </div>
      </div>
    </header>
  );
};

export default MovieHeader;
