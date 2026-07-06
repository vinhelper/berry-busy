import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

import { prisma } from '@/lib/prisma';

if (process.env.NODE_ENV === 'production' && !process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET must be set in production.');
}

const AUTH_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [new URL(AUTH_URL).host, 'berry-busy-*.vercel.app'],
    fallback: AUTH_URL,
    protocol: 'auto',
  },
  trustedOrigins: [AUTH_URL, 'https://berry-busy-*.vercel.app'],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  plugins: [nextCookies()],
});
