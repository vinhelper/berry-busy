import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { auth } from '@/lib/auth';
import { getBoardWithListsAndCards } from '@/lib/boards/queries';
import { BoardHeader } from '@/components/board/board-header';
import { BoardCanvas } from '@/components/board/board-canvas';
import { Badge } from '@/components/ui/badge';
import { AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { UserAvatar } from '@/components/user-avatar';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardId: string }>;
}): Promise<Metadata> {
  const { boardId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { title: 'BerryBusy' };

  const board = await getBoardWithListsAndCards(boardId, session.user.id);
  return { title: board ? `${board.title} · BerryBusy` : 'BerryBusy' };
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const board = await getBoardWithListsAndCards(boardId, session.user.id);
  if (!board) notFound();

  const role =
    board.members.find((member) => member.userId === session.user.id)?.role ??
    (board.ownerId === session.user.id ? 'OWNER' : 'VIEWER');
  const canEdit = role !== 'VIEWER';

  const cardCount = board.lists.reduce(
    (sum, list) => sum + list.cards.length,
    0
  );
  const members = board.members.map((member) => member.user);

  return (
    <div className="flex min-h-svh flex-col">
      <BoardHeader />

      <main className="mx-auto w-full max-w-360 flex-1 px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-primary/5 ring-1 ring-foreground/5">
          {/* board bar */}
          <div className="flex items-center justify-between gap-4 border-b bg-muted/40 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <Link
                href="/boards"
                aria-label="Back to your boards"
                className="-ml-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <span className="size-2.5 shrink-0 rounded-full bg-primary" />
              <span className="truncate font-medium">{board.title}</span>
              <Badge
                variant="outline"
                className="hidden shrink-0 sm:inline-flex"
              >
                {cardCount} {cardCount === 1 ? 'card' : 'cards'}
              </Badge>
            </div>
            {members.length > 0 && (
              <AvatarGroup>
                {members.slice(0, 4).map((user) => (
                  <UserAvatar key={user.id} user={user} />
                ))}
                {members.length > 4 && (
                  <AvatarGroupCount className="size-6">
                    +{members.length - 4}
                  </AvatarGroupCount>
                )}
              </AvatarGroup>
            )}
          </div>

          {/* columns */}
          <BoardCanvas
            lists={board.lists}
            boardId={board.id}
            canEdit={canEdit}
          />
        </div>
      </main>
    </div>
  );
}
