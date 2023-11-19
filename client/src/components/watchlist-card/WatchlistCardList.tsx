import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import React from 'react';
import WatchlistCard from './watchlist-card-item/WatchlistCard';

const WatchlistCardList = ({
  watchlists
}: {
  watchlists: WathclistListItem[];
}) => {
  return (
    <div>
      {watchlists.map((watchlist) => (
        <WatchlistCard key={watchlist.id} item={watchlist} />
      ))}
    </div>
  );
};

export default WatchlistCardList;
