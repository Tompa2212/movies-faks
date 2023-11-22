import React from 'react';
import { Button } from '../ui/Button';
import BookmarkedIcon from './BookmarkedIcon';
import BookmarkIcon from './BookmarkIcon';
import getUserWatchlists from '@/data/get-user-watchlists';
import { getAuthSession } from '@/lib/get-session';
import BookmarkedToggleAction from './BookmarkedToggleAction';

type BookmarkedToggleProps = {
  isBookmarked: boolean;
  movieId: number;
  className?: string;
};

const BookmarkedToggle = async ({
  isBookmarked,
  movieId,
  className
}: BookmarkedToggleProps) => {
  const session = await getAuthSession();
  const userWatchlists = await getUserWatchlists(session?.user.id!);

  return (
    <BookmarkedToggleAction
      movieId={movieId}
      watchlists={userWatchlists}
      isBookmarked={isBookmarked}
    >
      <Button variant="link" className={className}>
        {isBookmarked ? <BookmarkedIcon /> : <BookmarkIcon />}
      </Button>
    </BookmarkedToggleAction>
  );
};

export default BookmarkedToggle;
