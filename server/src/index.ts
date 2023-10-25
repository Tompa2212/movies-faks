import dotenv from 'dotenv';
dotenv.config();
import { pool, db } from './db';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { users, genres, movies, movieGenres } from './db/schema';
import { chunkify } from './utils/chunkify';
import { movieRepository } from './repository/movie.repository';

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
      await mongoDb.collection('movies').find().toArray()
    ).map(m => ({
      mongoId: String(m._id),
      title: m.title,
      released: m.released,
      runtime: m.runtime || 70 + Math.floor(Math.random() * 90),
      plot: m.plot,
      fullPlot: m.fullPlot,
      poster: m.plot,
      type: m.type,
      releasedYear: m.releasedYear
    }));

    for (let chunk of chunkify(mongoMovies, 24)) {
      await db.insert(movies).values(chunk);
    }
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
    // for (let chunk of chunkify(mComments, 42)) {
    //   await db.insert(comments).values(chunk);
    // }
  } finally {
    // Ensures that the client will close when you finish/error

    await client.close();
  }
})();
