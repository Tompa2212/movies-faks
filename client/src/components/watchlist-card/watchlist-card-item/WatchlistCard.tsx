import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import React from 'react';

import WatchlistCardUsers from './WatchlistCardUsers';
import WatchlistCardMovies from './WatchlistCardMovies';
import WatchlistCardHeader from './WatchlistCardHeader';
import { WatchlistProvider } from '@/providers/WatchlistProvider';

const WatchlistCard = ({
  item: { id, title, movies, users, ownerId }
}: {
  item: WathclistListItem;
}) => {
  return (
    <WatchlistProvider watchlist={{ id, title, ownerId }}>
      <div className="max-w-4xl p-4 mb-4 border rounded-sm border-zinc-200">
        <WatchlistCardHeader id={id} title={title} ownerId={ownerId} />
        <div className="flex flex-wrap justify-between gap-4">
          <WatchlistCardMovies movies={movies || []} />
          <WatchlistCardUsers users={users} />
        </div>
      </div>
    </WatchlistProvider>
  );
};

export default WatchlistCard;
