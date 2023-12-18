import WatchlistInvActions from '@/components/watchlist-inv-actions/WatchlistInvActions';
import { getUserInvites } from '@/data/user/invites';
import { getAuthSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import React from 'react';

export const dynamic = 'force-dynamic';

const page = async () => {
  const session = await getAuthSession();

  if (!session) {
    return redirect('/sign-in');
  }

  const invites = await getUserInvites(session?.user.id);

  return (
    <section>
      <div className="flex flex-col max-w-xl gap-4 mx-auto">
        {invites.length ? (
          invites.map((invite: any) => (
            <div key={invite.id} className="p-4 border-b rounded">
              <div className="mb-4">
                <h3 className="mb-2 font-semibold">Watchlist Invite</h3>
                <p>
                  {invite.sender.email} invited you to join watchlist{' '}
                  <span className="font-semibold">
                    {invite.watchlistTitle}.
                  </span>
                </p>
              </div>
              <WatchlistInvActions watchlistInvId={invite.id} />
            </div>
          ))
        ) : (
          <h3>No pending invites...</h3>
        )}
      </div>
    </section>
  );
};

export default page;
