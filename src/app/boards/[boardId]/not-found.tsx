import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function BoardNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Board not found
        </h1>
        <p className="text-muted-foreground">
          It may have been deleted, or you don&apos;t have access to it.
        </p>
      </div>
      <Button asChild>
        <Link href="/boards">Back to your boards</Link>
      </Button>
    </div>
  );
}
