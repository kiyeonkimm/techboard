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
              password: '', // 소셜 로그인은 비밀번호 없음
              is_admin: false, // 🔥 GitHub은 무조건 일반 유저로 등록
            },
          });
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        // 🔥 GitHub 로그인은 관리자 아님
        if (account?.provider === 'github') {
          token.is_admin = false;
        } else {
          token.is_admin = user.is_admin;
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
