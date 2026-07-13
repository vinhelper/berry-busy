import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function requireBoardAccess(
  boardId: string,
  opts?: { write?: boolean }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('UNAUTHORIZED');

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [
        { ownerId: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    include: {
      members: { where: { userId: session.user.id }, select: { role: true } },
    },
  });
  if (!board) throw new Error('NOT_FOUND');

  const role =
    board.members[0]?.role ??
    (board.ownerId === session.user.id ? 'OWNER' : null);
  if (!role) throw new Error('NOT_FOUND');
  if (opts?.write && role === 'VIEWER') throw new Error('FORBIDDEN');

  return { userId: session.user.id, board, role };
}
