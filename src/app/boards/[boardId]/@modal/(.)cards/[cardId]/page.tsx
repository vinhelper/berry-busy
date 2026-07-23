import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { getCardForDetail, resolveBoardRole } from '@/lib/boards/queries';
import { CardDetail } from '@/components/board/card/card-detail';
import { CardModal } from '@/components/board/card/card-modal';

export default async function InterceptedCardModal({
  params,
}: {
  params: Promise<{ boardId: string; cardId: string }>;
}) {
  const { cardId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const card = await getCardForDetail(cardId, session.user.id);
  if (!card) notFound();

  const role = resolveBoardRole(card.list.board, session.user.id);

  return (
    <CardModal>
      <CardDetail
        card={card}
        canEdit={role !== 'VIEWER'}
        currentUserId={session.user.id}
        isOwner={role === 'OWNER'}
        variant="modal"
      />
    </CardModal>
  );
}
