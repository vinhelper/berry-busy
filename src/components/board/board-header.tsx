import Link from 'next/link';

import { Logo } from '@/components/logo';
import { SignOutButton } from '@/components/auth/sign-out-button';

export function BoardHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/boards" aria-label="Back to your boards">
          <Logo />
        </Link>
        <SignOutButton />
      </div>
    </header>
  );
}
