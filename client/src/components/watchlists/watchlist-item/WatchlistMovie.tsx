import React from 'react';
import Image from 'next/image';
import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import { fallbackMovieImg } from '@/config/base-url.config';
import Icon from '@/components/ui/Icons';

import WatchlistMovieDeleteButton from './WatchlistMovieDeleteButton';
import Link from 'next/link';

const WatchlistMovie = ({
  movie
}: {
  movie: WathclistListItem['movies'][number];
}) => {
  return (
    <div
      key={movie.id}
      className="flex-shrink-0 overflow-hidden rounded max-w-[170px]"
    >
      <div className="grid items-center grid-cols-1 grid-rows-1 mb-1 isolate group">
        <Image
          className="h-[170px] w-[170px] object-cover -z-10 col-span-full row-span-full"
          src={movie.poster || fallbackMovieImg}
          width={150}
          height={170}
          alt={movie.title}
        />
        <div className="w-full h-full transition-opacity opacity-0 pointer-events-none col-span-full row-span-full group-hover:opacity-100 group-hover:pointer-events-auto bg-black/70">
          <div className="flex justify-between">
            <span className="flex items-center text-zinc-50">
              <Icon
                name="Star"
                className="w-5 h-5 mx-1 my-2 fill-yellow-400 stroke-yellow-400"
              />
              {movie.rating}
            </span>
            <WatchlistMovieDeleteButton movie={movie} />
          </div>
        </div>
      </div>
      <Link
        href={`/titles/${movie.id}`}
        title={movie.title}
        className="line-clamp-2 hover:underline underline-offset-4"
      >
        {movie.title}
      </Link>
    </div>
  );
};

export default WatchlistMovie;
