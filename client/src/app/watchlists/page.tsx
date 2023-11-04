import getUserWatchlists from '@/data/get-user-watchlists';
import { getSession } from '@/lib/get-session';
import React from 'react';

type Props = {};

const Page = async (props: Props) => {
  const session = await getSession();

  const watchlists = await getUserWatchlists(session?.user.id!);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Watchlists</h1>
      <section className="py-4">
        {watchlists.map(watchlist => {
          return (
            <div key={watchlist.id}>
              <h3>{watchlist.title}</h3>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Page;
