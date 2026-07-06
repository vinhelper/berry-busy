import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { auth } from '@/lib/auth';
import { Logo } from '@/components/logo';
import { SignOutButton } from '@/components/auth/sign-out-button';

export const metadata: Metadata = {
  title: 'Your boards · BerryBusy',
};

export default async function BoardsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const { user } = session;

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">
          Welcome, {user.name}.
        </h1>
        <p className="mt-3 max-w-md text-pretty text-muted-foreground">
          You&apos;re signed in. Your boards will live here once we build them
          out. For now, this page just proves the front door works.
        </p>
      </main>
    </div>
  );
}
