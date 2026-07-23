import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { auth } from '@/lib/auth';
import { getBoardsForUser } from '@/lib/boards/queries';
import { Logo } from '@/components/logo';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { CreateBoardForm } from '@/components/boards/create-board-form';
import { BoardCard } from '@/components/boards/board-card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Your boards · BerryBusy',
};

export default async function BoardsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const boards = await getBoardsForUser(session.user.id);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          Welcome, {session.user.name}.
        </h1>

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Your boards
          </h2>
          <Badge variant="outline">
            {boards.length === 0
              ? 'None yet'
              : `${boards.length} ${boards.length === 1 ? 'board' : 'boards'}`}
          </Badge>
        </div>

        <div className="mt-4 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CreateBoardForm />
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={{
                id: board.id,
                title: board.title,
                description: board.description,
                listCount: board._count.lists,
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
