import { SessionUser } from './User';

declare global {
  namespace Express {
    export interface Request {
      user: SessionUser;
    }
  }
}

export {};
