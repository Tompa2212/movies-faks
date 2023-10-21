import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME!,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST!,
    port: parseInt(process.env.DATABASE_PORT!)
  }
} satisfies Config;
