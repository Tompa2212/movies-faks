import { pgRepository } from './base-repository/pg.repository';
import { Watchlist } from '../types/Watchlist';
import { pool } from '../db';
import { WatchlistDto, WathclistListDto } from '../types/dto-types/watchlist';

function makeWatchlistRepository() {
  const base = pgRepository<Watchlist>({
    table: 'watchlists',
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
    return await base.findById(id);
  };

  const findWatchlistWithUsersAndMovies = async (
    id: number
  ): Promise<WatchlistDto | null> => {
    const res = await pool.query<WatchlistDto>(
      `
      select
      w.id,
      w.title,
      w.owner_id as "ownerId",
      w_movies.*,
      w_users.*
    from
      watchlists w
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
    left join lateral (
      select
        array_to_json(array_agg(movies)) as movies
      from
        watchlist_movies wm
      join lateral (
        select
          m.id,
          m.title,
          m.poster,
          m.rating,
          m.plot,
          m.released,
          m.type,
          wm.date_added as "dateAdded",
          m_genres.*
        from
          movies m
        join lateral (
          select
            array_to_json(
              array_agg(
                json_build_object('id',
            g.id,
            'name',
            g.name))) as genres
          from
            movie_genres mg
          join genres g
              on
            mg.genre_id = g.id
          where
            mg.movie_id = m.id
          group by
            m.id
              
          ) m_genres on
          true
        where
          m.id = wm.movie_id
        order by
          wm.date_added desc
              
            ) movies on
        true
      where
        wm.watchlist_id = w.id
      group by
        w.id
          ) w_movies on
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
      w.id,
      w.title,
      w.owner_id as "ownerId",
      w_movies.*,
      w_users.*
    from
      watchlists w
    join watchlist_users wu
      on w.id = wu.watchlist_id
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
    left join lateral (
      select
        array_to_json(array_agg(movies)) as movies
      from
        watchlist_movies wm
      join lateral (
        select
          m.id,
          m.title,
          m.poster,
          m.rating,
          m.plot,
          m.released,
          m.type,
          wm.date_added as "dateAdded",
          wm.added_by as "addedBy"
        from
          movies m
        where
          m.id = wm.movie_id
        order by
          wm.date_added desc 
              
            ) movies on
        true
      where
        wm.watchlist_id = w.id
      group by
        w.id
          ) w_movies on
      true
    where
      wu.user_id = $1;
      `,
      [userId]
    );

    return res.rows;
  };

  const create = async (title: string, ownerId: number) => {
    const res = await pool.query<Watchlist>(
      `
    INSERT INTO ${base.table} (title, owner_id)
    VALUES ($1, $2)
    RETURNING ${base.allColumns}`,
      [title, ownerId]
    );

    return res.rows[0];
  };

  return {
    ...base,
    create,
    findWatchlistsByUserId,
    findWatchlistWithUsersAndMovies,
    findBaseWatchlistById
  };
}

export const watchlistRepository = makeWatchlistRepository();
