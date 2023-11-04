import { pool } from '../db';
import { WatchlistMovie } from '../types/Watchlist';
import { pgRepository } from './base-repository/pg.repository';

function makeWatchlistMovieRepository() {
  const base = pgRepository<WatchlistMovie>({
    table: 'watchlist_movies',
    mapping: {
      watchlistId: 'watchlist_id',
      movieId: 'movie_id',
      order: 'order',
      addedBy: 'added_by'
    }
  });

  const addMovieToWatchlist = async (
    watchlistId: number,
    movieId: number,
    userId: number
  ) => {
    const res = await pool.query(
      `
    INSERT INTO 
    ${base.table} (watchlist_id, movie_id, added_by, "order")
    VALUES ($1, $2, $3, (select
                        MAX(wm."order") + 1
                    from
                    watchlist_movies wm
                    where
                    watchlist_id = $4))
    RETURNING ${base.allColumns}
    `,
      [watchlistId, movieId, userId, watchlistId]
    );

    return res.rows;
  };

  const removeMovieFromWatchlist = async (
    watchlistId: number,
    movieId: number
  ) => {
    const res = await pool.query(
      `
    DELETE 
    FROM ${base.table}
    WHERE watchlist_id = $1 AND
      movie_id = $2
    RETURNING ${base.allColumns}
    `,
      [watchlistId, movieId]
    );

    return res.rows;
  };

  const findWatchlistMovies = async (watchlistId: number) => {
    const res = await pool.query<number[]>(
      `
          SELECT movie_id
          FROM ${base.table}
          WHERE watchlist_id = $1
      `,
      [watchlistId]
    );

    return res.rows;
  };

  const findWatchlistMovieAndWatchlistOwner = async (
    watchlistId: number,
    movieId: number
  ): Promise<WatchlistMovie & { watchlistOwnerId: number }> => {
    const res = await pool.query<WatchlistMovie & { watchlistOwnerId: number }>(
      `
     SELECT ${base.allColumns}, w.owner_id AS "watchlistOwnerId"
     FROM ${base.table}
     JOIN watchlists w
       ON ${base.table}.watchlist_id = w.id
     WHERE watchlist_id = $1 AND
       movie_id = $2
    `,
      [watchlistId, movieId]
    );

    return res.rows[0] ?? null;
  };

  return {
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    findWatchlistMovies,
    findWatchlistMovieAndWatchlistOwner
  };
}

export const watchlistMovieRepository = makeWatchlistMovieRepository();
