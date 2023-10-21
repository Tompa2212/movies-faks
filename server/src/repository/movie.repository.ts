import { Pool } from 'pg';
import { query } from '../utils/query-functions';
import { pgRepository } from './base-repository/pg.repository';
import Movie from '../entities/Movie';

export default function movieRepository(pool: Pool) {
  const base = pgRepository<Movie>({
    pool,
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
      mongoId: 'mongo_id'
    }
  });

  async function findBySearch(search: string) {
    return query<Movie>(`SELECT * FROM movies WHERE title LIKE $1 || '%'`, [
      search
    ]);
  }

  return {
    ...base,
    findBySearch
  };
}
