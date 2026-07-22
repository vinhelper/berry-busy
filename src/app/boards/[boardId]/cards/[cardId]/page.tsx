import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

import { auth } from '@/lib/auth';
import { getCardForDetail, resolveBoardRole } from '@/lib/boards/queries';
import { CardDetail } from '@/components/board/card/card-detail';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardId: string }>;
}): Promise<Metadata> {
  const { cardId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { title: 'BerryBusy' };

  const card = await getCardForDetail(cardId, session.user.id);
  return { title: card ? `${card.title} · BerryBusy` : 'BerryBusy' };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ boardId: string; cardId: string }>;
}) {
  const { boardId, cardId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const card = await getCardForDetail(cardId, session.user.id);
  if (!card) notFound();

  const role = resolveBoardRole(card.list.board, session.user.id);
  const canEdit = role !== 'VIEWER';
  const isOwner = role === 'OWNER';

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={`/boards/${boardId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to board
      </Link>
      <div className="rounded-xl border bg-card p-6 shadow-sm ring-1 ring-foreground/5">
        <CardDetail
          card={card}
          canEdit={canEdit}
          currentUserId={session.user.id}
          isOwner={isOwner}
          variant="page"
        />
      </div>
    </div>
  );
}
