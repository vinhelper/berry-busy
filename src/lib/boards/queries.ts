import { prisma } from '@/lib/prisma';

/** Boards the user can see (owner is stored as a member, so this covers both). */
export function getBoardsForUser(userId: string) {
  return prisma.board.findMany({
    where: { members: { some: { userId } } },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { lists: true } } },
  });
}

/**
 * A single board with its lists and cards (ordered by position), plus each
 * card's labels, assignees, and comment/attachment counts. Scoped to the user
 * so it doubles as an access check — returns null if they can't see it.
 */
export function getBoardWithListsAndCards(boardId: string, userId: string) {
  return prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      lists: {
        orderBy: { position: 'asc' },
        include: {
          cards: {
            orderBy: { position: 'asc' },
            include: {
              labels: { include: { label: true } },
              assignees: {
                include: {
                  user: { select: { id: true, name: true, image: true } },
                },
              },
              _count: { select: { comments: true, attachments: true } },
            },
          },
        },
      },
    },
  });
}

export type BoardDetail = NonNullable<
  Awaited<ReturnType<typeof getBoardWithListsAndCards>>
>;
export type ListWithCards = BoardDetail['lists'][number];
export type CardWithRelations = ListWithCards['cards'][number];
