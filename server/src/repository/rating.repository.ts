import { pool } from '../db';
import { NewRating, Rating } from '../types/Rating';
import { pgRepository } from './base-repository/pg.repository';

const makeRatingRepository = () => {
  const base = pgRepository<Rating>({
    table: 'ratings',
    primaryKey: 'id',
    mapping: {
      id: 'id',
      movieId: 'movie_id',
      userId: 'user_id',
      rating: 'rating',
      timestamp: 'timestamp'
    }
  });

  const insertRating = async (data: NewRating) => {
    const res = await pool.query(
      `
          INSERT INTO ${base.table}
          (rating, movie_id, user_id)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, movie_id) DO UPDATE SET
            rating = excluded.rating,
            "timestamp" = now()
          RETURNING ${base.allColumns};
      `,
      [data.rating, data.movieId, data.userId]
    );

    return res.rows[0] ?? null;
  };

  const updateRating = async (id: number, rating: number) => {
    const res = await pool.query(
      `
          UPDATE rating
          SET rating = $1, "timestamp" = now() 
          WHERE id = $2
          RETURNING ${base.allColumns}
      `,
      [rating, id]
    );

    return res.rows[0] ?? null;
  };

  const findByUserId = async (userId: number) => {
    const res = await pool.query(
      `
      select 
      r.id,
      r.movie_id as "movieId",
      r."timestamp",
      r.rating as "userRating",
      m.title,
      m.plot,
      m.full_plot as "fullPlot",
      m.poster,
      m.runtime,
      genres.* as genres
     from ratings r
     join movies m
       on r.movie_id = m.id
     join lateral (
       select
         array_to_json(
           array_agg(
           json_build_object(
            'id', g.id,
            'name', g.name
           )
          )
         ) as genres
       from movie_genres mg
       join genres g
         on mg.genre_id = g.id
       where mg.movie_id = m.id
       group by mg.movie_id
     ) genres on true
     where user_id = $1;
      `,
      [userId]
    );

    return res.rows;
  };

  return {
    ...base,
    insertRating,
    updateRating,
    findByUserId
  };
};

export const ratingRepository = makeRatingRepository();
