import { Pool } from 'pg';
import { pgRepository } from './base-repository/pg.repository';

export default function userRepository(pool: Pool) {
  const base = pgRepository({
    pool,
    table: 'users',
    primaryKey: 'id',
    mapping: {
      id: 'id'
    }
  });

  return {
    ...base
  };
}

export type UserRepository = ReturnType<typeof userRepository>;
