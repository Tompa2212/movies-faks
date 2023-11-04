import NextAuth, { AuthOptions, getServerSession } from 'next-auth';

import GoogleProvider from 'next-auth/providers/google';
import { pool } from '@/db';
import PostgresAdapter from './auth-adapter';

const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool),
  pages: {
    signIn: '/sign-in'
  },
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = +user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.username = user.username;
      }

      return token;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.username = token.username;
      }

      return session;
    },
    redirect() {
      return '/';
    }
  }
};

export default NextAuth(authOptions);

export const getAuthSession = () => getServerSession(authOptions);
