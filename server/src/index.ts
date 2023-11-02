import dotenv from 'dotenv';
dotenv.config();
import { db, pool } from './db';
import bcrypt, { hashSync } from 'bcrypt';
import { MongoClient, ServerApiVersion } from 'mongodb';
import {
  usersTable,
  genresTable,
  moviesTable,
  movieGenresTable,
  ratingsTable,
  watchlistsTable,
  watchlistUsersTable
} from './db/schema';
import crypto from 'node:crypto';
import { chunkify } from './utils/chunkify';
import { movieRepository } from './repository/movie.repository';
import { faker } from '@faker-js/faker';
import { hash } from './utils/hashing';
import { createRatingsArray } from './utils/createRatingsArray';
import { and, eq, inArray, sql } from 'drizzle-orm';

const uri =
  'mongodb+srv://myAtlasDBUser:admin@myatlasclusteredu.ngkx2wm.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

(async () => {
  try {
    await client.connect();
    const mongoDb = client.db('sample_mflix');
  } finally {
    // Ensures that the client will close when you finish/error

    await client.close();
  }
})();
