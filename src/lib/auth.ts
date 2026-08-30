import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Nodemailer from 'next-auth/providers/nodemailer';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './db';

// Safely collect valid providers
const activeProviders: any[] = [];

if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
  activeProviders.push(
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    })
  );
}

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  activeProviders.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  activeProviders.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_HOST !== 'smtp.example.com') {
  activeProviders.push(
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@neko-life.local',
    })
  );
}

// Guarantee at least one provider exists so NextAuth initialization never fails
if (activeProviders.length === 0) {
  activeProviders.push(
    Credentials({
      id: 'demo',
      name: 'Dev Demo',
      credentials: { email: { label: 'Email', type: 'email' } },
      async authorize(creds) {
        const email = String(creds?.email || '').trim().toLowerCase();
        if (!email || !email.includes('@')) return null;
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, name: email.split('@')[0] },
          });
        }
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: activeProviders,
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
