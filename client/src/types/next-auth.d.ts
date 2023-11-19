import type { Session, User } from 'next-auth';
import type { JWT as authJwt } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends authJwt {
    id: number;
    email: string;
    firstName: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      username?: string | null;
      firstName: string;
      image?: string | null;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: number;
    email: string;
    accessToken: string;
    refreshToken: string;
    firstName: string;
  }
}
