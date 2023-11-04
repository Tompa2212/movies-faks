import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolClient, PoolConfig } from 'pg';
import * as schema from './schema';

const access: PoolConfig = {
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  max: 10
};

export const pool = new Pool(access);

// class MyLogger implements Logger {
//   logQuery(query: string, params: unknown[]): void {
//     console.log({ query, params });
//   }
// }

export const db = drizzle(pool, { schema });

export const getConnect = (tx?: PoolClient): Promise<PoolClient> => {
  if (tx) {
    return tx as unknown as Promise<PoolClient>;
  }

  return pool.connect();
};
