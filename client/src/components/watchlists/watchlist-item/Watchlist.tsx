import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import React from 'react';

import WatchlistUsers from './WatchlistUsers';
import WatchlistMovies from './WatchlistMovies';
import WatchlistHeader from './WatchlistHeader';
import { WatchlistProvider } from '@/providers/WatchlistProvider';

const Watchlist = ({
  item: { id, title, movies, users, ownerId }
}: {
  item: WathclistListItem;
}) => {
  return (
    <WatchlistProvider watchlist={{ id, title, ownerId }}>
      <div className="max-w-4xl p-4 mb-4 border rounded-sm border-zinc-200">
        <WatchlistHeader id={id} title={title} ownerId={ownerId} />
        <div className="flex flex-wrap justify-between gap-4">
          <WatchlistMovies movies={movies || []} />
          <WatchlistUsers users={users} />
        </div>
      </div>
    </WatchlistProvider>
  );
};

export default Watchlist;
