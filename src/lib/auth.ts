import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

import { prisma } from '@/lib/prisma';

if (process.env.NODE_ENV === 'production' && !process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET must be set in production.');
}

export const auth = betterAuth({
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
