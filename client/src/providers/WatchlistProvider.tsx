'use client';
import { Watchlist } from '@/types/Watchlist';
import React from 'react';

const watchlistContext = React.createContext<Watchlist | undefined>(undefined);

export const useWatchlist = () => {
  const context = React.useContext(watchlistContext);

  if (context === undefined) {
    throw new Error(
      "Can't use wathlist context outside of watchlist provider."
    );
  }

  return context;
};

export const WatchlistProvider = ({ children, watchlist }: any) => {
  return (
    <watchlistContext.Provider value={watchlist}>
      {children}
    </watchlistContext.Provider>
  );
};
