import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { auth } from '@/lib/auth';
import { getBoardWithListsAndCards } from '@/lib/boards/queries';
import { BoardHeader } from '@/components/board/board-header';
import { BoardColumn } from '@/components/board/board-column';
import { AddListForm } from '@/components/board/add-list-form';
import { Badge } from '@/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

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
                  <Avatar key={user.id}>
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback className="font-medium">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
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
          <div className="flex items-start gap-3 overflow-x-auto bg-linear-to-b from-muted/20 to-transparent p-4">
            {board.lists.map((list) => (
              <BoardColumn key={list.id} list={list} canEdit={canEdit} />
            ))}
            {canEdit ? (
              <AddListForm boardId={board.id} />
            ) : (
              board.lists.length === 0 && (
                <p className="px-2 py-6 text-sm text-muted-foreground">
                  This board is empty.
                </p>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
