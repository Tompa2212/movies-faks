'use client';
import React, { useTransition } from 'react';
import Icon from '@/components/ui/Icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/Tooltip';
import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import { useWatchlist } from '@/providers/WatchlistProvider';
import { useSession } from '@/providers/SessionProvider';
import { removeMovie } from '@/actions/watchlist-remove-movie';
import { useRouter } from 'next/navigation';

const WatchlistMovieDeleteButton = ({
  movie
}: {
  movie: WathclistListItem['movies'][number];
}) => {
  const { ownerId, id } = useWatchlist();
  const [session] = useSession();
  const router = useRouter();

  const [, startTransition] = useTransition();

  if (!session) {
    return null;
  }

  if (ownerId !== session.user.id && movie.addedBy !== session.user.id) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger
        type="submit"
        className="px-2"
        onClick={() =>
          startTransition(async () => {
            await removeMovie(id, movie.id);
            router.refresh();
          })
        }
      >
        <Icon
          name="BookmarkMinus"
          className="stroke-red-500 hover:translate-y-[1px]"
        />
      </TooltipTrigger>
      <TooltipContent>Remove Movie</TooltipContent>
    </Tooltip>
  );
};

export default WatchlistMovieDeleteButton;
