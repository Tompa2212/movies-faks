import { db, pool } from '../db';
import { watchlistUsersTable } from '../db/schema';

function makeWatchlistUserRepository() {
  const table = 'watchlist_users';

  const addUsersToWatchlist = async (
    data: { watchlistId: number; userId: number }[]
  ) => {
    const res = await db
      .insert(watchlistUsersTable)
      .values(data)
      .onConflictDoNothing()
      .returning({
        watchlistId: watchlistUsersTable.watchlistId,
        userId: watchlistUsersTable.userId
      });

    return res;
  };

  const removeUserFromWatchlist = async (
    watchlistId: number,
    userId: number
  ) => {
    const res = await pool.query(
      `
    DELETE 
    FROM ${table}
    WHERE watchlist_id = $1 AND
      user_id = $2
    RETURNING *
    `,
      [watchlistId, userId]
    );

    return res.rows;
  };

  const findWatchlistUsers = async (watchlistId: number) => {
    const res = await pool.query<{ userId: number }>(
      `
        SELECT user_id AS "userId"
        FROM ${table}
        WHERE watchlist_id = $1
    `,
      [watchlistId]
    );

    return res.rows;
  };

  return {
    addUsersToWatchlist,
    removeUserFromWatchlist,
    findWatchlistUsers
  };
}

export const watchlistUserRepository = makeWatchlistUserRepository();
