import { db, pool } from '../db';
import { watchlistInvitationsTable } from '../db/schema';
import {
  NewWatchlistInvitation,
  WatchlistInvitation
} from '../types/Watchlist';
import { pgRepository } from './base-repository/pg.repository';

function makeWatchlistInvitationRepository() {
  const base = pgRepository<WatchlistInvitation>({
    table: 'watchlist_invitations',
    mapping: {
      id: 'id',
      watchlistId: 'watchlist_id',
      senderId: 'sender_id',
      recipientId: 'recipient_id',
      invitationDateTime: 'invitation_date_time',
      status: 'status'
    }
  });

  const insertMany = async (values: NewWatchlistInvitation[]) => {
    return db
      .insert(watchlistInvitationsTable)
      .values(values)
      .onConflictDoNothing()
      .returning();
  };

  const findByRecipientId = async (id: number) => {
    const res = await pool.query(
      `
    select 
      wi.id,
      wi.watchlist_id as "watchlistId",
      w.title as "watchlistTitle",
      wi.status,
      wi.invitation_date_time as "invitationDateTime",
      json_build_object('id', sender.id, 'email', sender.email) as sender
    from 
    watchlist_invitations wi
    join watchlists w
      on wi.watchlist_id = w.id
    join users sender
      on wi.sender_id = sender.id
    join users rec
      on wi.recipient_id = rec.id
    where wi.recipient_id = $1;
    `,
      [id]
    );

    return res.rows;
  };

  return {
    findById: base.findById,
    deleteById: base.deleteById,
    insertMany,
    findByRecipientId
  };
}

export const watchlistInviteRepository = makeWatchlistInvitationRepository();
