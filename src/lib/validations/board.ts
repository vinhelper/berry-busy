import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional(),
});

export const renameBoardSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
});

export const createListSchema = z.object({
  boardId: z.string().min(1),
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
});

export const renameListSchema = z.object({
  listId: z.string().min(1),
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
});

export const createCardSchema = z.object({
  listId: z.string().min(1),
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
});

export const renameCardSchema = z.object({
  cardId: z.string().min(1),
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type RenameBoardInput = z.infer<typeof renameBoardSchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type RenameListInput = z.infer<typeof renameListSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type RenameCardInput = z.infer<typeof renameCardSchema>;
