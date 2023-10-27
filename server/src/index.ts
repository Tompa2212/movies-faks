import dotenv from 'dotenv';
dotenv.config();
import { db } from './db';
import bcrypt from 'bcrypt';
import { MongoClient, ServerApiVersion } from 'mongodb';
import {
  usersTable,
  genresTable,
  moviesTable,
  movieGenresTable
} from './db/schema';
import crypto from 'node:crypto';
import { chunkify } from './utils/chunkify';
import { movieRepository } from './repository/movie.repository';
import { faker } from '@faker-js/faker';
import { hash } from './utils/hashing';

function generateUser() {
  const password = faker.internet.password();
  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(password, salt);
  const username = faker.internet.userName();
  const email = faker.internet
    .email()
    .split('@')
    .map((v, i) => {
      if (i === 0) {
        v += crypto.randomInt(5000);
      }

      return v;
    })
    .join('@');
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    username,
    email,
    password: hashedPass,
    firstName,
    lastName
  };
}

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

    const mongoMovies = (
      await mongoDb.collection('movies').find().limit(10).toArray()
    ).reduce((acc, curr) => {
      if (!curr.imdb) {
        return acc;
      }

      if (!curr.imdb.rating) {
        return acc;
      }

      const { rating, votes } = curr.imdb;
      acc[String(curr._id)] = { rating, votes: votes > 1000 ? 1000 : votes };

      return acc;
    }, {} as any);

    const sqlMovies = (await db.query.moviesTable.findMany()).reduce(
      (acc, curr) => {
        if (curr.mongoId) {
          acc[curr.mongoId] = curr.id;
        }

        return acc;
      },
      {} as any
    );

    const users = [];
    for (let i = 0; i < 2000; i++) {
      users.push(generateUser());
    }

    await db.insert(usersTable).values(users);

    // await db.update(movies).set({});
    // const usersEmailToIdMap = (await db.query.users.findMany()).reduce(
    //   (acc, curr) => {
    //     acc[curr.email] = curr.id;
    //     return acc;
    //   },
    //   {} as Record<string, number>
    // );
    // const sqlMovies = await db.query.movies.findMany();
    // const mongoIdToMovieIdMap = sqlMovies.reduce((acc, curr) => {
    //   if (curr.mongoId) {
    //     acc[curr.mongoId] = curr.id;
    //   }
    //   return acc;
    // }, {} as Record<string, number>);
    // const allComments = await mongoDb.collection('comments').find().toArray();
    // const mComments: any[] = [];
    // for (let comment of allComments) {
    //   const { text, date, movie_id, email } = comment;
    //   mComments.push({
    //     text,
    //     date,
    //     movieId: mongoIdToMovieIdMap[movie_id],
    //     userId: usersEmailToIdMap[email]
    //   });
    // }
    // for (let chunk of chunkify(movieGenres, 50)) {
    //   await db.insert(movieGenresTable).values(chunk);
    // }
  } finally {
    // Ensures that the client will close when you finish/error

    await client.close();
  }
})();
