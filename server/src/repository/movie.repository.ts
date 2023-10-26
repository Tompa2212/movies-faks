import { pgRepository } from './base-repository/pg.repository';
import Movie from '../entities/Movie';
import { pool } from '../db';

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
      mongoId: 'mongo_id'
    }
  });

  async function findBySearch(search: string) {
    return pool.query<Movie>(
      `SELECT ${base.allColumns} FROM ${base.table} WHERE title LIKE $1 || '%'`,
      [search]
    );
  }

  return {
    ...base,
    findBySearch
  };
}

export const movieRepository = makeMovieRepository();
