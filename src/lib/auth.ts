import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Nodemailer from 'next-auth/providers/nodemailer';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './db';

const providers: any[] = [];

// NextAuth v5 automatically picks up process.env.AUTH_DISCORD_ID & AUTH_DISCORD_SECRET
if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
  providers.push(Discord);
}

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub);
}

const emailHost = process.env.EMAIL_SERVER_HOST;
export const isEmailConfigured = !!emailHost && emailHost !== 'smtp.example.com';

if (isEmailConfigured) {
  providers.push(
    Nodemailer({
      server: {
        host: emailHost,
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

// Fallback to Credentials if no OAuth/Email providers are present
export const isDevDemo = providers.length === 0;

if (isDevDemo) {
  providers.push(
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

export const hasOAuth = providers.some((p: any) => p && p.id !== 'demo' && p.id !== 'nodemailer');

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: isDevDemo ? undefined : PrismaAdapter(prisma),
  providers,
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: isDevDemo ? 'jwt' : 'database' },
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verify=1',
  },
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        (session.user as any).id = (user as any)?.id ?? (token as any)?.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
});
