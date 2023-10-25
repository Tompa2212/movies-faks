import { Session } from 'express-session';
import { SessionUser } from './User';

declare module 'express-session' {
  interface Session {
    user: SessionUser;
  }
}
