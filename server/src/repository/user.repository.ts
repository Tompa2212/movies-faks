import { Pool } from 'pg';
import { pgRepository } from './base-repository/pg.repository';
import User from '../entities/User';
import { pool } from '../db';

function makeUserRepository(pool: Pool) {
  const base = pgRepository<User>({
    pool,
    table: 'users',
    primaryKey: 'id',
    mapping: {
      id: 'id',
      email: 'email',
      password: 'password',
      username: 'username',
      firstName: 'first_name',
      lastName: 'last_name'
    }
  });

  async function findByEmail(email: string) {
    const resp = await base.find({ email });

    if (!resp.length) {
      return null;
    }

    return resp[0];
  }

  return {
    ...base,
    findByEmail
  };
}

export const userRepository = makeUserRepository(pool);
