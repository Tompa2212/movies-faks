import RedisStore from 'connect-redis';
import redisClient from '../utils/redis-client';
import session from 'express-session';

const redisStore = new RedisStore({
  client: redisClient
});

export const sessionMiddleware = session({
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
});
