import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import { db } from './db';
import { sendVerificationEmail } from './email';
import { Role } from '@/types';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as NextAuthOptions['adapter'],
  providers: [

    // Email Verification Provider
    ...(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD && process.env.EMAIL_FROM ? [EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT ? parseInt(process.env.EMAIL_SERVER_PORT, 10) : undefined,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url, provider: _provider }) => {
        await sendVerificationEmail(email, url);
      },
    })] : []),

    // GitHub OAuth
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          githubUsername: profile.login,
          role: 'STUDENT' as const,
        };
      },
    })] : []),

    // Google OAuth
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET ? [GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'STUDENT' as const,
        };
      },
    })] : []),

    // Discord OAuth
    ...(process.env.DISCORD_ID && process.env.DISCORD_SECRET ? [DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.global_name || profile.username,
          email: profile.email,
          image: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
          username: profile.username,
          role: 'STUDENT' as const,
        };
      },
    })] : []),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user: _user, account, profile: _profile }) {
      // Allow OAuth sign-ins
      if (account?.provider !== 'credentials') {
        return true;
      }

      // For credentials provider, user is already validated in authorize
      return true;
    },

    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
      }

      // Update user data from OAuth providers
      if (account?.provider === 'github' && profile) {
        token.githubUsername = (profile as { login?: string }).login;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.username = token.username as string;
        session.user.githubUsername = token.githubUsername as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  events: {
    async signIn({ user, account, profile: _profile, isNewUser }) {
      // Update last active date
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { lastActiveDate: new Date() },
        });
      }

      // Create activity log for new users
      if (isNewUser) {
        await db.activity.create({
          data: {
            userId: user.id,
            type: 'SUBMISSION_CREATED', // Using existing enum
            description: 'User signed up',
            metadata: JSON.stringify({ provider: account?.provider }),
            xpEarned: 10,
          },
        });
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
