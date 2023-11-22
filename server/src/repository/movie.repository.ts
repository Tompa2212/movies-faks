import { pgRepository } from './base-repository/pg.repository';
import { Movie } from '../types/Movie';
import { pool } from '../db';
import { MovieDto, MovieListDto } from '../types/dto-types/movies';
import { Pagination } from '../types/Pagination';

function makeMovieRepository() {
  const base = pgRepository<Movie>({
    table: 'movies',
    primaryKey: 'id',
    mapping: {
      id: 'id',
      title: 'title',
      plot: 'plot',
      fullPlot: 'full_plot',
      type: 'type',
      poster: 'poster',
      runtime: 'runtime',
      released: 'released',
      releasedYear: 'released_year',
      rating: 'rating',
      votes: 'votes',
      mongoId: 'mongoId'
    }
  });

  async function findBySearch(
    search: string,
    pagination?: { limit: number; offset: number }
  ) {
    let paginationSql = '';
    const params: Array<number | string> = [search];

    if (pagination) {
      if (pagination.offset) {
        params.push(pagination.offset);
        paginationSql += ` OFFSET $${params.length}`;
      }

      if (pagination.limit) {
        params.push(pagination.limit);
        paginationSql += `LIMIT $${params.length}`;
      }
    }

    const res = await pool.query<Movie>(
      `SELECT 
         ${base.allColumns}
       FROM ${base.table} 
       WHERE title ILIKE $1 || '%'
       ${paginationSql}
       `,
      params
    );

    return res.rows;
  }

  async function findTop250Movies() {
    const res = await pool.query<MovieListDto>(
      `SELECT 
            m.id,
            m.title,
            m.plot,
            m.poster,
            m.released,
            m.runtime,
            m.rating,
            m.votes,
            m_genres.* as genres,
            RANK() OVER (ORDER BY m.rating desc nulls last, m.votes desc) AS rank
            FROM movies m
            LEFT JOIN LATERAL (
              SELECT array_to_json(array_agg(json_build_object('id', g.id, 'name', g.name))) as genres
              FROM movie_genres mg
              INNER JOIN genres g ON mg.genre_id = g.id
              WHERE mg.movie_id = m.id
              GROUP BY mg.movie_id
            ) AS m_genres ON TRUE
            where m."type" = 'movie' AND
              m.votes > 200
            order by m.rating desc nulls last, m.votes desc
            limit 250;`
    );

    return res.rows;
  }

  const findById = async (titleId: number, userId?: number) => {
    const authUserSql = userId
      ? `left join lateral (
      select COUNT(*) > 0 as "isBookmarked"
      from watchlist_movies wm
      join watchlists w
        on wm.watchlist_id = w.id
      join watchlist_users wu
        on w.id = wu.watchlist_id
      where wu.user_id = $2 and
      wm.movie_id = m.id
    ) m_bookmark on true
    left join lateral (
      select json_build_object('id', r.id ,'rating', r.rating) as "userRating"
      from ratings r
      where r.user_id = $2 and
      r.movie_id = m.id
    ) user_rating on true`
      : `
      left join lateral (select false as "isBookmarked") m_bookmark on true
      left join lateral (select null as "userRating") user_rating on true`;

    const sql = `
    select
      ${base.allColumns},
      m_genres.*,
      m_bookmark.*,
      user_rating.*
    from
      movies m
    join lateral (
      select
        array_to_json(
      array_agg(
        json_build_object('id',
        g.id,
        'name',
        g."name")
      )
    ) as genres
      from
        movie_genres mg
      join genres g
      on
        mg.genre_id = g.id
      where
        mg.movie_id = m.id
    ) as m_genres on
      true
    ${authUserSql}
    where
      id = $1;`;

    const res = await pool.query<MovieDto>(
      sql,
      userId ? [titleId, userId] : [titleId]
    );

    return res.rows[0];
  };

  async function findTop250Series() {
    const res = await pool.query<MovieListDto>(
      `SELECT 
            m.id,
            m.title,
            m.plot,
            m.poster,
            m.released,
            m.runtime,
            m.rating,
            m.votes,
            m_genres.*,
            RANK() OVER (ORDER BY m.rating desc nulls last, m.votes desc) AS rank
            FROM movies m
            LEFT JOIN LATERAL (
              SELECT array_to_json(array_agg(json_build_object('id', g.id, 'name', g.name))) as genres
              FROM movie_genres mg
              INNER JOIN genres g ON mg.genre_id = g.id
              WHERE mg.movie_id = m.id
              GROUP BY mg.movie_id
            ) AS m_genres ON TRUE
            where m."type" = 'series' AND
              m.votes > 200
            order by m.rating desc nulls last, m.votes desc
            limit 250;`
    );

    return res.rows;
  }

  return {
    ...base,
    findBySearch,
    findTop250Movies,
    findTop250Series,
    findById
  };
}

export const movieRepository = makeMovieRepository();
