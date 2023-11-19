// import NextAuth, { AuthOptions, getServerSession } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

// import api from './create-fetcher';
// import { AxiosError } from 'axios';

// const authOptions: AuthOptions = {
//   pages: {
//     signIn: '/sign-in'
//   },
//   session: {
//     strategy: 'jwt'
//   },
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { email: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' }
//       },
//       async authorize(credentials) {
//         try {
//           const {
//             data: { user, ...rest }
//           } = await api.post('/auth/login', credentials);

//           return { ...user, ...rest };
//         } catch (error) {
//           if (error instanceof AxiosError) {
//             throw new Error(error.response?.data.description);
//           }
//           return null;
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         return { ...user, ...token };
//       }

//       return { ...token };
//     },
//     async session({ token, session }) {
//       if (session.user) {
//         session.user.id = token.id;
//         session.user.email = token.email;
//         session.user.firstName = token.firstName;
//       }

//       session.accessToken = token.accessToken;
//       session.refreshToken = token.refreshToken;

//       return session;
//     }
//   }
// };

// export default NextAuth(authOptions);

// export const getAuthSession = () => getServerSession(authOptions);
