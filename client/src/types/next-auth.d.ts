import type { Session, User } from 'next-auth';
import type { JWT as authJwt } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT extends authJwt {
    id: number;
    email: string;
    username?: string | null;
    firstName?: string;
    lastName?: string | null;
    image: string | null;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      username?: string | null;
      firstName?: string;
      lastName?: string | null;
      image: string | null;
    };
  }

  interface User {
    id: number;
    firstName?: string;
    lastName?: string | null;
    username?: string | null;
  }
}
