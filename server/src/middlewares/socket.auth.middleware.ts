import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketIncomingMessage } from '../types/socket-http';

export const socketAuthMiddleware = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  next: (err?: ExtendedError | undefined) => void
) => {
  const req = socket.request as SocketIncomingMessage;

  if (!req.session || !req.session.user) {
    return next(new Error('Unauthorized'));
  }

  req.session.reload((err: any) => {
    if (err) {
      socket.disconnect();
    } else {
      next();
    }
  });

  req.session.reload;
  return next();
};
