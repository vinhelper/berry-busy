'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';

import { createBoard } from '@/lib/boards/actions';
import {
  createBoardSchema,
  type CreateBoardInput,
} from '@/lib/validations/board';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function CreateBoardForm() {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
  });

  function openForm() {
    setOpen(true);
    requestAnimationFrame(() => setFocus('title'));
  }

  function cancel() {
    reset();
    setFormError(null);
    setOpen(false);
  }

  async function onSubmit(values: CreateBoardInput) {
    setFormError(null);
    try {
      await createBoard(values);
      reset();
      setOpen(false);
    } catch {
      setFormError('Could not create the board. Please try again.');
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={openForm}
        className={cn(
          'flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground transition-colors',
          'hover:border-primary/40 hover:text-foreground'
        )}
      >
        <Plus className="size-5" />
        New board
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-32 flex-col gap-2 rounded-xl border bg-card p-4 ring-1 ring-foreground/5"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="board-title">Title</Label>
        <Input
          id="board-title"
          placeholder="e.g. Product roadmap"
          aria-invalid={!!errors.title}
          {...register('title')}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="board-description">
          Description{' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="board-description"
          rows={2}
          placeholder="What's this board for?"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {formError && <p className="text-xs text-destructive">{formError}</p>}

      <div className="mt-auto flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Create
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={cancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
