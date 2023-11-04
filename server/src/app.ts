import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.router';
import errorHandler from './middlewares/error.middleware';
import { getConnect } from './db';
import RedisStore from 'connect-redis';
import session from 'express-session';
import redisClient from './utils/redis-client';
import { isAuthenticated } from './middlewares/auth.middleware';
import { userRouter } from './routes/user.router';
import { movieRouter } from './routes/movie.router';
import { watchlistRouter } from './routes/watchlist.router';

const PORT = process.env.PORT || 3001;
const app = express();

const redisStore = new RedisStore({
  client: redisClient
});

app.set('trust proxy', 1);
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    name: 'sessionid',
    store: redisStore,
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET!,
    cookie: {
      httpOnly: true,
      signed: true,
      maxAge: 15 * 60 * 1000
      // secure: true
    }
  })
);
app.get('/', (_, res) => {
  return res.send('<h1>Movies API</h1>');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/users', isAuthenticated, userRouter);
app.use('/api/v1/watchlists', isAuthenticated, watchlistRouter);

app.use(errorHandler);

const start = async () => {
  let conn;
  try {
    conn = await getConnect();
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

start();
