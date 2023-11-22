import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import { connectAll } from './config/messaging.config';
import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.router';
import errorHandler from './middlewares/error.middleware';
import { getConnect } from './db';
import { sessionMiddleware } from './middlewares/session.middleware';
import { isAuthenticated } from './middlewares/auth.middleware';
import { userRouter } from './routes/user.router';
import { movieRouter } from './routes/movie.router';
import { watchlistRouter } from './routes/watchlist.router';
import { watchlistInvitationRouter } from './routes/watchlist-invitation.router';
import { createSocketServer } from './config/socket.config';
import { SocketIncomingMessage } from './types/socket-http';
import { notificationRouter } from './routes/notification.router';
import { featuredRouter } from './routes/featured.router';
import { ratingRouter } from './routes/rating.router';

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);

app.set('trust proxy', 1);
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(sessionMiddleware);
app.get('/', (_, res) => {
  return res.send('<h1>Movies API</h1>');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/users', isAuthenticated, userRouter);
app.use('/api/v1/watchlists', isAuthenticated, watchlistRouter);
app.use(
  '/api/v1/watchlist-invitations',
  isAuthenticated,
  watchlistInvitationRouter
);
app.use('/api/v1/notifications', isAuthenticated, notificationRouter);
app.use('/api/v1/featured', featuredRouter);
app.use('/api/v1/ratings', isAuthenticated, ratingRouter);

app.use(errorHandler);

const start = async () => {
  let conn;
  try {
    conn = await getConnect();
    await connectAll();
    httpServer.listen(PORT, () => {
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

const io = createSocketServer(httpServer);

io.on('connection', (socket) => {
  const req = socket.request as SocketIncomingMessage;

  const user = req.session.user;

  socket.join(user.id.toString());

  console.log(socket.rooms);
});
