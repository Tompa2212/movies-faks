import { db } from '@/db';
import { MovieListDTO } from '@/types/Movie';
import { sql } from 'drizzle-orm';

export async function getTop250Movies() {
  const res = await db.execute(
    sql.raw(
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
        where m."type" = 'movie' AND
          m.votes > 200
        order by m.rating desc nulls last, m.votes desc
        limit 250;`
    )
  );

  return res.rows as MovieListDTO[];
}

export async function getTop250TvShows() {
  const res = await db.execute(
    sql.raw(
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
    )
  );

  return res.rows as MovieListDTO[];
}
