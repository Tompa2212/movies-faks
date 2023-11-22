import CreateWatchlistSheet from '@/components/CreateWatchlistSheet';
import InviteToWatchlistSheet from '@/components/InviteToWatchlistSheet';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icons';
import WatchlistCardList from '@/components/watchlist-card/WatchlistCardList';
import getUserWatchlists from '@/data/get-user-watchlists';
import { getAuthSession } from '@/lib/get-session';
import React from 'react';

const Page = async () => {
  const session = await getAuthSession();
  const watchlists = await getUserWatchlists(session?.user.id!);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Watchlists</h1>
      <section className="py-4 lg:gap-12 lg:flex">
        <aside className="h-full mb-6 lg:top-0 lg:sticky lg:order-2 lg:max-w-sm">
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">Create new watchlist</h2>
            <p>
              List your movie, TV & celebrity picks. Share your watchlists with
              others.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <CreateWatchlistSheet>
              <Button variant="subtle" className="flex-shrink-0">
                Create Watchlist
                <Icon className="w-4 h-4 ml-2" name="Plus" />
              </Button>
            </CreateWatchlistSheet>
            <InviteToWatchlistSheet
              watchlists={watchlists.filter(
                (w) => w.ownerId === session?.user.id
              )}
            >
              <Button variant="subtle" className="flex-shrink-0">
                Invite users <Icon className="w-4 h-4 ml-2" name="UserCheck" />
              </Button>
            </InviteToWatchlistSheet>
          </div>
        </aside>
        <WatchlistCardList watchlists={watchlists} />
      </section>
    </div>
  );
};

export default Page;
