import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BoardPreview } from '@/components/landing/board-preview';

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10 sm:pt-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          The busy part is done.
          <br className="hidden sm:block" /> Now just move the cards.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
          BerryBusy is a kanban board for small teams who would rather ship work
          than manage the tool that tracks it. You don&apos;t have to sit
          through a demo to understand.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/boards">
              Create your first board
              <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Free while we are in beta. No credit card, no sales call.
        </p>
      </div>

      <div className="mt-14 sm:mt-16">
        <BoardPreview />
      </div>
    </section>
  );
}
