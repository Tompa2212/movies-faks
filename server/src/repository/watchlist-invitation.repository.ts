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
      recipientId: 'recepient_id',
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

  return {
    findById: base.findById,
    deleteById: base.deleteById,
    insertMany
  };
}

export const watchlistInviteRepository = makeWatchlistInvitationRepository();
