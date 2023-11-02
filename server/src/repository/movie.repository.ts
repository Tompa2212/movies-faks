import { pgRepository } from './base-repository/pg.repository';
import { Movie } from '../types/Movie';
import { pool } from '../db';
import { MovieListDto } from '../types/dto-types/movies';

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
      mongoId: 'mongo_id'
    }
  });

  async function findBySearch(search: string) {
    return pool.query<Movie>(
      `SELECT ${base.allColumns} FROM ${base.table} WHERE title LIKE $1 || '%'`,
      [search]
    );
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
    findTop250Series
  };
}

export const movieRepository = makeMovieRepository();
