import { fallbackMovieImg } from '@/config/base-url.config';
import { Movie } from '@/types/Movie';
import { getYearFromDate } from '@/utils/get-year-from-date';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

type MovieSearchItemProps = {
  isFocused: boolean;
  onSelect: () => void;
  movie: Movie;
};

const MovieSearchItem = ({
  movie,
  isFocused,
  onSelect
}: MovieSearchItemProps) => {
  return (
    <li
      className={clsx(
        'p-2 cursor-pointer hover:bg-zinc-100 focus-visible:bg-red-300',
        isFocused && 'bg-zinc-100'
      )}
      onMouseDown={() => onSelect()}
    >
      <div className="flex items-center gap-2">
        <Image
          src={movie.poster || fallbackMovieImg}
          alt={movie.title}
          className="object-cover w-11 h-11"
          width={80}
          height={40}
        />
        <div>
          <p>{movie.title}</p>
          {movie.released && (
            <small className="text-gray-400">
              {getYearFromDate(new Date(movie.released))}
            </small>
          )}
        </div>
      </div>
    </li>
  );
};

export default MovieSearchItem;
