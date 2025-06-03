import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import db from '@/lib/db';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Github,
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: String(credentials.email) },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.password
        );
        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          is_admin: user.is_admin,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'github') {
        const existingUser = await db.user.findUnique({
          where: { email: String(user.email) },
        });

        if (!existingUser) {
          await db.user.create({
            data: {
              name: user.name ?? 'GitHubUser',
              email: String(user.email),
              password: '',
              is_admin: false,
            },
          });
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;

        // ✅ DB에서 user.id와 is_admin을 확실하게 가져옴 (GitHub 대응)
        const dbUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = String(dbUser.id); // 🔥 핵심
          token.is_admin = dbUser.is_admin;
        } else {
          token.id = '';
          token.is_admin = false;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.is_admin = token.is_admin as boolean;
      }
      return session;
    },
  },
});
