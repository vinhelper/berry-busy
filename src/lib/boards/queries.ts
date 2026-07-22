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
      labels: { orderBy: { name: 'asc' } },
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

export function getCardForDetail(cardId: string, userId: string) {
  return prisma.card.findFirst({
    where: {
      id: cardId,
      list: {
        board: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      },
    },
    include: {
      labels: { include: { label: true } },
      assignees: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      list: {
        select: {
          board: {
            select: {
              id: true,
              ownerId: true,
              labels: { orderBy: { name: 'asc' } },
              members: {
                include: {
                  user: { select: { id: true, name: true, image: true } },
                },
              },
            },
          },
        },
      },
    },
  });
}

export type CardDetailData = NonNullable<
  Awaited<ReturnType<typeof getCardForDetail>>
>;
export type CardDetailComment = CardDetailData['comments'][number];

export type BoardDetail = NonNullable<
  Awaited<ReturnType<typeof getBoardWithListsAndCards>>
>;
export type ListWithCards = BoardDetail['lists'][number];
export type CardWithRelations = ListWithCards['cards'][number];
export type BoardLabel = BoardDetail['labels'][number];
export type BoardMemberWithUser = BoardDetail['members'][number];

export function resolveBoardRole(
  board: {
    ownerId: string;
    members: { userId: string; role: BoardMemberWithUser['role'] }[];
  },
  userId: string
) {
  return (
    board.members.find((member) => member.userId === userId)?.role ??
    (board.ownerId === userId ? 'OWNER' : 'VIEWER')
  );
}
