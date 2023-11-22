import { Session } from 'express-session';
import { IncomingMessage } from 'node:http';

export type SocketIncomingMessage = IncomingMessage & {
  session: Session;
};
