import GoogleProvider from 'next-auth/providers/google';
import type {
  NextAuthOptions,
  User as NextAuthUser,
  Profile,
  Account,
} from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';

import connectDB from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import User from '@/models/userModel';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text',
          placeholder: 'Email',
        },
        password: {
          label: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await verifyPassword(
          credentials.password,
          user.password,
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          savedCustomizedDesign: user.savedCustomizedDesign,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async ({
      user,
      account,
      profile,
    }: {
      user: NextAuthUser | AdapterUser;
      account: Account | null;
      profile?: Profile;
    }) => {
      if (account?.provider === 'google' && profile?.email) {
        try {
          await connectDB();
          const { email } = user;
          const existingUser = await User.findOne({
            email: email,
          });

          if (!existingUser) {
            const createdUser = await User.create({
              email: email,
              firstName: profile?.given_name ?? 'Google',
              lastName: profile?.family_name ?? 'User',
            });

            if (createdUser) {
              console.debug('New User created in DB, signing in');
              return true;
            }
            console.debug('Failed to create user in DB');
            return false;
          } else {
            console.debug('User exists in DB, signing in');
            return true;
          }
        } catch (error) {
          console.error(error);
        }
      }
      return false;
    },
    /**
     * This callback is called whenever a session is checked.
     * (Eg.: invoking the `/api/session` endpoint, using `useSession` or `getSession`)
     *
     * If you want to make something available you added to the token through the `jwt` callback,
     * you have to explicitly forward it here to make it available to the client.
     */
    session: async ({ session, token }) => {
      if (session?.user && token?.uid) {
        session.user.id = token.uid;
        session.user.firstName = token?.firstName;
        session.user.lastName = token?.lastName;
        session.user.name = token?.name;
      } else {
        console.debug('Session User does not exist');
      }

      return session;
    },
    /**
     * This callback is called whenever a JSON Web Token is created (i.e. at sign in)
     * or updated (i.e whenever a session is accessed in the client).
     * Its content is forwarded to the `session` callback,
     * where you can control what should be returned to the client.
     * Anything else will be kept from your front-end.
     *
     * The returned value will be encrypted, and it is stored in a cookie.
     * Requests to /api/auth/signin, /api/auth/session and
     * calls to getSession(), getServerSession(), useSession() will invoke this function,
     * but only if you are using a JWT session.
     * This method is not invoked when you persist sessions in a database.
     */
    jwt: async ({ user, token, account, profile }) => {
      if (
        account?.provider === 'google' &&
        account?.providerAccountId === user?.id &&
        profile?.email
      ) {
        const existingUser = await User.findOne({
          email: token.email,
        });

        if (existingUser) {
          token.uid = existingUser._id;
          token.firstName = existingUser.firstName;
          token.lastName = existingUser.lastName;
          token.name = existingUser.firstName + ' ' + existingUser.lastName;
        }
      } else if (user) {
        token.firstName = user?.firstName;
        token.lastName = user?.lastName;
        token.name = user?.firstName + ' ' + user?.lastName;
        token.uid = user.id;
      }

      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
