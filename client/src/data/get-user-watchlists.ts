import api from '@/lib/create-fetcher';
import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import { cache } from 'react';

export const revalidate = 10;

const getUserWatchlists = cache(async (userId: number) => {
  const { data } = await api.get<WathclistListItem[]>(
    `/users/${userId}/watchlists`
  );

  return data;
});

export default getUserWatchlists;
