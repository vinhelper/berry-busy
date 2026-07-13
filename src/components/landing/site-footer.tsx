import Link from 'next/link';

import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Logo className="text-sm" />
          <p className="text-sm text-muted-foreground">
            Made for teams that are, well, berry busy.
          </p>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <Link
            href="/login"
            className="transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <span>© 2026 BerryBusy</span>
        </div>
      </div>
    </footer>
  );
}
