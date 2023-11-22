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

  return {
    ...base,
    insertRating,
    updateRating
  };
};

export const ratingRepository = makeRatingRepository();
