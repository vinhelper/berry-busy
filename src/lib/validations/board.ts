import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional(),
});

export const renameBoardSchema = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title is too long'),
});

export const createListSchema = z.object({
  boardId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title is too long'),
});

export const renameListSchema = z.object({
  listId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title is too long'),
});

export const createCardSchema = z.object({
  listId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
});

export const renameCardSchema = z.object({
  cardId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
});

export const updateCardSchema = z.object({
  cardId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  description: z.string().trim().max(5000, 'Description is too long'),
  dueDate: z.string().min(1).nullable(),
  labelIds: z.array(z.string().min(1)),
  assigneeIds: z.array(z.string().min(1)),
});

export const addCommentSchema = z.object({
  cardId: z.string().min(1),
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment is too long'),
});

export const createLabelSchema = z.object({
  boardId: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name is too long'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Enter a valid hex color'),
});

export const reorderListSchema = z.object({
  listId: z.string().min(1),
  beforeId: z.string().min(1).nullable().optional(),
  afterId: z.string().min(1).nullable().optional(),
});

export const moveCardSchema = z.object({
  cardId: z.string().min(1),
  toListId: z.string().min(1),
  beforeId: z.string().min(1).nullable().optional(),
  afterId: z.string().min(1).nullable().optional(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type RenameBoardInput = z.infer<typeof renameBoardSchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type RenameListInput = z.infer<typeof renameListSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type RenameCardInput = z.infer<typeof renameCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
export type ReorderListInput = z.infer<typeof reorderListSchema>;
export type MoveCardInput = z.infer<typeof moveCardSchema>;
