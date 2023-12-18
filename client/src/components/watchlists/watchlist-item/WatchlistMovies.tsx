import React from 'react';

import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import { ScrollBar, ScrollArea } from '@/components/ui/ScrollArea';
import WatchlistMovie from './WatchlistMovie';

const WatchlistMovies = ({
  movies
}: {
  movies: WathclistListItem['movies'];
}) => {
  return (
    <div className="max-w-full">
      <h3 className="text-lg font-semibold">Movies</h3>
      <ScrollArea className="max-w-[100%]">
        <div className="flex gap-4">
          {movies.length ? (
            movies.map((movie) => (
              <WatchlistMovie key={movie.id} movie={movie} />
            ))
          ) : (
            <p>No movies</p>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default WatchlistMovies;
