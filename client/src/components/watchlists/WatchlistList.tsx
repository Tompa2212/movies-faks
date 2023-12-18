import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import React from 'react';
import Watchlist from './watchlist-item/Watchlist';

const WatchlistList = ({ watchlists }: { watchlists: WathclistListItem[] }) => {
  return (
    <div className="flex-1">
      {watchlists.map((watchlist) => (
        <Watchlist key={watchlist.id} item={watchlist} />
      ))}
    </div>
  );
};

export default WatchlistList;
