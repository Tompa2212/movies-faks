import Link from 'next/link';
import React from 'react';

import { getAuthSession } from '@/lib/get-session';
import WatchlistDeleteButton from './WatchlistDeleteButton';
import WatchlistAddMovie from './WatchlistAddMovie';

const WatchlistHeader = async ({
  title,
  id,
  ownerId
}: {
  title: string;
  id: number;
  ownerId: number;
}) => {
  const session = await getAuthSession();

  const canDelete = session?.user.id === ownerId;

  return (
    <header className="flex justify-between mb-3">
      <h3 className="mb-5 text-xl font-semibold">
        <Link
          className="hover:underline underline-offset-4"
          href={`/watchlists/${id}`}
        >
          {title}
        </Link>
      </h3>
      <div className="flex items-center">
        <WatchlistAddMovie />
        {canDelete ? <WatchlistDeleteButton /> : null}
      </div>
    </header>
  );
};

export default WatchlistHeader;
