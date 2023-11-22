import React from 'react';
import { MovieDto } from '@/types/dto-types/MovieDto';
import Image from 'next/image';
import BookmarkedToggle from '../bookmarked-toggle/BookmarkedToggle';
import { createDurationLabel } from '@/utils/create-duration-label';
import { Badge } from '../ui/Badge';
import { fallbackMovieImg } from '@/config/base-url.config';

const MovieContent = ({ movie }: { movie: MovieDto }) => {
  console.log(movie);

  return (
    <div className="flex flex-wrap gap-6">
      <div className="relative flex-shrink-0 overflow-hidden">
        <Image
          src={movie.poster || fallbackMovieImg}
          alt={movie.title}
          width={300}
          height={300}
          className="w-full max-w-[300px] xs:max-w-full rounded-sm"
        />
        <BookmarkedToggle
          isBookmarked={movie.isBookmarked}
          movieId={movie.id}
          className="absolute top-0 left-0 h-auto p-0"
        />
      </div>
      <div className="flex-1 min-w-[25ch] flex flex-col gap-3">
        {movie.released ? (
          <p className="font-semibold">
            Released:{' '}
            <span className="font-normal text-gray-500">
              {new Date(movie.released).toLocaleDateString()}
            </span>
          </p>
        ) : null}
        {movie.runtime ? (
          <p className="font-semibold">
            Runtime:{' '}
            <span className="font-normal text-gray-500">
              {createDurationLabel(movie.runtime)}
            </span>
          </p>
        ) : null}
        <div className="flex gap-2">
          <p className="font-semibold">Genres: </p>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <Badge variant="outline" key={genre.id}>
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>
        <p>{movie.fullPlot || movie.plot}</p>
      </div>
    </div>
  );
};

export default MovieContent;
