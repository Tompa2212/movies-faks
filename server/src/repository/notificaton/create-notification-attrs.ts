import { WatchlistInvitation } from '../../types/Watchlist';
import { pool } from '../../db';
const notificationTypes = [
  'watchlist_invitation',
  'watchlist_invitation_accept',
  'watchlist_added_movie',
  'watchlist_removed_movie',
  'watchlist_delete',
  'rating_like',
  'app_notification'
] as const;

type EntityData =
  | {
      type: 'watchlist_invitation';
      data: WatchlistInvitation;
    }
  | {
      type: 'watchlist_invitation_accept';
      data: WatchlistInvitation;
    };

export const createNotificationAttributes = async (data: EntityData) => {
  switch (data.type) {
    case 'watchlist_invitation': {
      const res = await pool.query(
        `
            select
              json_build_object('id', w.id, 'title', w.title) as watchlist,
              json_build_object('id', sender.id, 'email', sender.email) as sender,
              sender.email || ' invited you to join watchlist ' || w.title as message,
              'Watchlist Invite' as title
            from watchlist_invitations wi
            join watchlists w
              on wi.watchlist_id = w.id
            join users sender
              on wi.sender_id = sender.id
            join users rec
              on wi.recipient_id = rec.id
            where wi.id = $1;
            `,
        [data.data.id]
      );

      return res.rows[0];
    }

    case 'watchlist_invitation_accept': {
      const res = await pool.query(
        `
      select
        json_build_object('id', w.id, 'title', w.title) as watchlist,
        s.* as sender,
        s.sender->>'email' || ' has joined your watchlist ' || w.title  as message
      from watchlists w
      join lateral (
        select
          json_build_object('id', u.id, 'email', u.email) as sender
        from users u
        where u.id = $1
      ) as s on true
      where id = $2;
      `,
        [data.data.senderId, data.data.watchlistId]
      );

      return res.rows[0];
    }
  }
};
