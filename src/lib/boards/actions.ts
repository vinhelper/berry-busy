'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  createBoardSchema,
  renameBoardSchema,
  createListSchema,
  renameListSchema,
  createCardSchema,
  renameCardSchema,
  updateCardSchema,
  createLabelSchema,
  addCommentSchema,
  reorderListSchema,
  moveCardSchema,
  type CreateBoardInput,
  type RenameBoardInput,
  type CreateListInput,
  type RenameListInput,
  type CreateCardInput,
  type RenameCardInput,
  type UpdateCardInput,
  type CreateLabelInput,
  type AddCommentInput,
  type ReorderListInput,
  type MoveCardInput,
} from '@/lib/validations/board';
import { requireBoardAccess } from '@/lib/boards/access';
import { positionAtEnd, positionBetween } from '@/lib/boards/position';

export async function createBoard(input: CreateBoardInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('UNAUTHORIZED');

  const data = createBoardSchema.parse(input);

  const board = await prisma.board.create({
    data: {
      title: data.title,
      description: data.description || null,
      ownerId: session.user.id,
      members: { create: { userId: session.user.id, role: 'OWNER' } },
    },
    select: { id: true },
  });

  revalidatePath('/boards');
  return board;
}

export async function renameBoard(input: RenameBoardInput) {
  const data = renameBoardSchema.parse(input);
  await requireBoardAccess(data.id, { write: true });

  await prisma.board.update({
    where: { id: data.id },
    data: { title: data.title },
  });

  revalidatePath('/boards');
  revalidatePath(`/boards/${data.id}`);
}

export async function deleteBoard(boardId: string) {
  const { role } = await requireBoardAccess(boardId, { write: true });
  if (role !== 'OWNER') throw new Error('FORBIDDEN');

  await prisma.board.delete({ where: { id: boardId } });
  revalidatePath('/boards');
}

export async function createList(input: CreateListInput) {
  const data = createListSchema.parse(input);
  await requireBoardAccess(data.boardId, { write: true });

  const last = await prisma.list.findFirst({
    where: { boardId: data.boardId },
    orderBy: { position: 'desc' },
    select: { position: true },
  });

  await prisma.list.create({
    data: {
      boardId: data.boardId,
      title: data.title,
      position: positionAtEnd(last?.position),
    },
  });

  revalidatePath(`/boards/${data.boardId}`);
}

export async function renameList(input: RenameListInput) {
  const data = renameListSchema.parse(input);
  const list = await prisma.list.findUnique({
    where: { id: data.listId },
    select: { boardId: true },
  });
  if (!list) throw new Error('NOT_FOUND');
  await requireBoardAccess(list.boardId, { write: true });

  await prisma.list.update({
    where: { id: data.listId },
    data: { title: data.title },
  });
  revalidatePath(`/boards/${list.boardId}`);
}

export async function reorderList(input: ReorderListInput) {
  const data = reorderListSchema.parse(input);
  const list = await prisma.list.findUnique({
    where: { id: data.listId },
    select: { boardId: true },
  });
  if (!list) throw new Error('NOT_FOUND');
  await requireBoardAccess(list.boardId, { write: true });

  const [before, after] = await Promise.all([
    data.beforeId
      ? prisma.list.findUnique({
          where: { id: data.beforeId },
          select: { position: true, boardId: true },
        })
      : null,
    data.afterId
      ? prisma.list.findUnique({
          where: { id: data.afterId },
          select: { position: true, boardId: true },
        })
      : null,
  ]);

  if (before && before.boardId !== list.boardId) throw new Error('BAD_REQUEST');
  if (after && after.boardId !== list.boardId) throw new Error('BAD_REQUEST');

  await prisma.list.update({
    where: { id: data.listId },
    data: { position: positionBetween(before?.position, after?.position) },
  });

  revalidatePath(`/boards/${list.boardId}`);
}

export async function deleteList(listId: string) {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    select: { boardId: true },
  });
  if (!list) throw new Error('NOT_FOUND');
  await requireBoardAccess(list.boardId, { write: true });

  await prisma.list.delete({ where: { id: listId } });
  revalidatePath(`/boards/${list.boardId}`);
}

export async function createCard(input: CreateCardInput) {
  const data = createCardSchema.parse(input);
  const list = await prisma.list.findUnique({
    where: { id: data.listId },
    select: { boardId: true },
  });
  if (!list) throw new Error('NOT_FOUND');
  await requireBoardAccess(list.boardId, { write: true });

  const last = await prisma.card.findFirst({
    where: { listId: data.listId },
    orderBy: { position: 'desc' },
    select: { position: true },
  });

  await prisma.card.create({
    data: {
      listId: data.listId,
      title: data.title,
      position: positionAtEnd(last?.position),
    },
  });
  revalidatePath(`/boards/${list.boardId}`);
}

export async function renameCard(input: RenameCardInput) {
  const data = renameCardSchema.parse(input);
  const card = await prisma.card.findUnique({
    where: { id: data.cardId },
    select: { list: { select: { boardId: true } } },
  });
  if (!card) throw new Error('NOT_FOUND');
  await requireBoardAccess(card.list.boardId, { write: true });

  await prisma.card.update({
    where: { id: data.cardId },
    data: { title: data.title },
  });
  revalidatePath(`/boards/${card.list.boardId}`);
}

export async function updateCard(input: UpdateCardInput) {
  const data = updateCardSchema.parse(input);
  const card = await prisma.card.findUnique({
    where: { id: data.cardId },
    select: { list: { select: { boardId: true } } },
  });
  if (!card) throw new Error('NOT_FOUND');
  const boardId = card.list.boardId;
  await requireBoardAccess(boardId, { write: true });

  let dueDate: Date | null = null;
  if (data.dueDate) {
    dueDate = new Date(data.dueDate);
    if (Number.isNaN(dueDate.getTime())) throw new Error('BAD_REQUEST');
  }

  const [boardLabels, boardMembers] = await Promise.all([
    prisma.label.findMany({
      where: { boardId, id: { in: data.labelIds } },
      select: { id: true },
    }),
    prisma.boardMember.findMany({
      where: { boardId, userId: { in: data.assigneeIds } },
      select: { userId: true },
    }),
  ]);
  const labelIds = boardLabels.map((l) => l.id);
  const assigneeIds = boardMembers.map((m) => m.userId);

  await prisma.$transaction([
    prisma.card.update({
      where: { id: data.cardId },
      data: {
        title: data.title,
        description: data.description || null,
        dueDate,
      },
    }),
    prisma.cardLabel.deleteMany({
      where: { cardId: data.cardId, labelId: { notIn: labelIds } },
    }),
    prisma.cardLabel.createMany({
      data: labelIds.map((labelId) => ({ cardId: data.cardId, labelId })),
      skipDuplicates: true,
    }),
    prisma.cardAssignee.deleteMany({
      where: { cardId: data.cardId, userId: { notIn: assigneeIds } },
    }),
    prisma.cardAssignee.createMany({
      data: assigneeIds.map((userId) => ({ cardId: data.cardId, userId })),
      skipDuplicates: true,
    }),
  ]);

  revalidatePath(`/boards/${boardId}`);
}

export async function createLabel(input: CreateLabelInput) {
  const data = createLabelSchema.parse(input);
  await requireBoardAccess(data.boardId, { write: true });

  const label = await prisma.label.create({
    data: { boardId: data.boardId, name: data.name, color: data.color },
    select: { id: true },
  });

  revalidatePath(`/boards/${data.boardId}`);
  return label;
}

export async function addComment(input: AddCommentInput) {
  const data = addCommentSchema.parse(input);
  const card = await prisma.card.findUnique({
    where: { id: data.cardId },
    select: { list: { select: { boardId: true } } },
  });
  if (!card) throw new Error('NOT_FOUND');
  const boardId = card.list.boardId;
  const { userId } = await requireBoardAccess(boardId, { write: true });

  const comment = await prisma.comment.create({
    data: { cardId: data.cardId, userId, content: data.content },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  revalidatePath(`/boards/${boardId}`);
  return comment;
}

export async function deleteComment(commentId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      userId: true,
      card: { select: { list: { select: { boardId: true } } } },
    },
  });
  if (!comment) throw new Error('NOT_FOUND');
  const boardId = comment.card.list.boardId;
  const { userId, role } = await requireBoardAccess(boardId, { write: true });

  if (comment.userId !== userId && role !== 'OWNER') {
    throw new Error('FORBIDDEN');
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/boards/${boardId}`);
}

export async function moveCard(input: MoveCardInput) {
  const data = moveCardSchema.parse(input);

  const card = await prisma.card.findUnique({
    where: { id: data.cardId },
    select: { list: { select: { boardId: true } } },
  });
  if (!card) throw new Error('NOT_FOUND');
  const boardId = card.list.boardId;
  await requireBoardAccess(boardId, { write: true });

  const targetList = await prisma.list.findUnique({
    where: { id: data.toListId },
    select: { boardId: true },
  });
  if (!targetList || targetList.boardId !== boardId) {
    throw new Error('BAD_REQUEST');
  }

  const [before, after] = await Promise.all([
    data.beforeId
      ? prisma.card.findUnique({
          where: { id: data.beforeId },
          select: { position: true, listId: true },
        })
      : null,
    data.afterId
      ? prisma.card.findUnique({
          where: { id: data.afterId },
          select: { position: true, listId: true },
        })
      : null,
  ]);

  if (before && before.listId !== data.toListId) throw new Error('BAD_REQUEST');
  if (after && after.listId !== data.toListId) throw new Error('BAD_REQUEST');

  await prisma.card.update({
    where: { id: data.cardId },
    data: {
      listId: data.toListId,
      position: positionBetween(before?.position, after?.position),
    },
  });

  revalidatePath(`/boards/${boardId}`);
}

export async function deleteCard(cardId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { list: { select: { boardId: true } } },
  });
  if (!card) throw new Error('NOT_FOUND');
  await requireBoardAccess(card.list.boardId, { write: true });

  await prisma.card.delete({ where: { id: cardId } });
  revalidatePath(`/boards/${card.list.boardId}`);
}
