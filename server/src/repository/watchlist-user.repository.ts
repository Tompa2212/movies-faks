import { pool } from '../db';

function makeWatchlistUserRepository() {
  const table = 'watchlist_users';

  const addUserToWatchlist = async (watchlistId: number, userId: number) => {
    const res = await pool.query(
      `
    INSERT INTO 
    ${table} (watchlist_id, user_id)
    VALUES ($1, $2)
    RETURNING *
    `,
      [watchlistId, userId]
    );

    return res.rows;
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
    addUserToWatchlist,
    removeUserFromWatchlist,
    findWatchlistUsers
  };
}

export const watchlistUserRepository = makeWatchlistUserRepository();
