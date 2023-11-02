import { pgRepository } from './base-repository/pg.repository';
import { Watchlist } from '../types/Watchlist';
import { pool } from '../db';
import { WatchlistDto, WathclistListDto } from '../types/dto-types/watchlist';

function makeWatchlistRepository() {
  const base = pgRepository<Watchlist>({
    table: 'users',
    primaryKey: 'id',
    mapping: {
      id: 'id',
      title: 'title',
      ownerId: 'owner_id'
    }
  });

  const findBaseWatchlistById = async (
    id: number
  ): Promise<Watchlist | null> => {
    const res = await pool.query<Watchlist>(
      `
      select * from watchlists where id = $1
    `,
      [id]
    );

    return res.rows[0] ?? null;
  };

  const findWatchlistById = async (
    id: number
  ): Promise<WatchlistDto | null> => {
    const res = await pool.query<WatchlistDto>(
      `
    select
      w.*,
      w_movies.*,
      w_users.*
    from
      watchlists w
    left join lateral (
      select
        array_to_json(
            array_agg(
              json_build_object('id',
        m.id,
        'title',
        m.title,
        'poster',
        m.poster,
        'rating',
        m.rating,
        'released',
        m.released,
        'plot',
        m.plot,
        'runtime',
        m.runtime)
            )
          ) as movies
      from
        watchlist_movies wm
      inner join movies m
            on
        wm.movie_id = m.id
      where
        wm.watchlist_id = w.id
      group by
        w.id
        ) as w_movies on
      true
    left join lateral (
      select
        array_to_json(
            array_agg(
              json_build_object('id',
        u.id,
        'firstName',
        u.first_name,
        'lastName',
        u.last_name,
        'username',
        u.username,
        'image',
        u.image)
            )
          ) as users
      from
        watchlist_users wu2
      join users u
            on
        wu2.user_id = u.id
      where
        wu2.watchlist_id = w.id
      group by
        w.id
        ) as w_users on
      true
    where
      w.id = $1;
    `,
      [id]
    );

    return res.rows[0] ?? null;
  };

  const findWatchlistsByUserId = async (userId: number) => {
    const res = await pool.query<WathclistListDto>(
      `
      select
        w.*,
        case
          when user_id = owner_id then true
          else false
        end as "isOwner",
        w_movies.*,
        w_users.*
      from
        watchlists w
      join watchlist_users wu
            on
        w.id = wu.watchlist_id
      left join lateral (
        select
          array_to_json(
              array_agg(
                json_build_object('id',
          m.id,
          'title',
          m.title,
          'poster',
          m.poster,
          'rating',
          m.rating)
              )
            ) as movies
        from
          watchlist_movies wm
        inner join movies m
              on
          wm.movie_id = m.id
        where
          wm.watchlist_id = w.id
        group by
          w.id
          ) as w_movies on
        true
      left join lateral (
        select
          array_to_json(
              array_agg(
                json_build_object('id',
          u.id,
          'firstName',
          u.first_name,
          'lastName',
          u.last_name,
          'username',
          u.username,
          'image',
          u.image)
              )
            ) as users
        from
          watchlist_users wu2
        join users u
              on
          wu2.user_id = u.id
        where
          wu2.watchlist_id = w.id
        group by
          w.id
          ) as w_users on
        true
      where
        wu.user_id = $1;
      `,
      [userId]
    );

    return res.rows;
  };

  const deleteWatchlist = async (
    id: number,
    ownerId: number
  ): Promise<Watchlist | null> => {
    const res = await pool.query<Watchlist>(
      `
      DELETE 
      FROM watchlists 
      where id = $1 and
        ownerId = $2
      RETURNING *
    `,
      [id, ownerId]
    );

    return res.rows[0] ?? null;
  };

  return {
    ...base,
    findWatchlistsByUserId,
    findWatchlistById,
    deleteWatchlist,
    findBaseWatchlistById
  };
}

export const watchlistRepository = makeWatchlistRepository();
