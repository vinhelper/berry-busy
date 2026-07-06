import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { Logo } from '@/components/logo';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect('/boards');

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="BerryBusy home">
            <Logo />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
