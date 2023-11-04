import api from '@/lib/create-fetcher';
import { WathclistListDto } from '@/types/dto-types/WatchlistDto';

export default async function getUserWatchlists(userId: number) {
  const {
    data: { data }
  } = await api.get<{ data: WathclistListDto[] }>(
    `/users/${userId}/watchlists`
  );

  return data;
}
