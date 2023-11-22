import { IncomingMessage, ServerResponse } from 'node:http';
import { Server } from 'socket.io';
import { sessionMiddleware } from '../middlewares/session.middleware';
import type { Server as HttpServer } from 'node:http';
import { socketAuthMiddleware } from '../middlewares/socket.auth.middleware';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const wrap = (expressMiddleware: any) => {
  return (socket: any, next: any) =>
    expressMiddleware(socket.request, {}, next);
};

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const createSocketServer = (
  httpServer: HttpServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.use(wrap(sessionMiddleware));
  io.use(socketAuthMiddleware);

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Configure Socker first -> configureSocket');
  }

  return io;
};
