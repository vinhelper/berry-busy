'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';

import { createList } from '@/lib/boards/actions';
import { createListSchema, type CreateListInput } from '@/lib/validations/board';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AddListForm({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: { boardId, title: '' },
  });

  function openForm() {
    setOpen(true);
    requestAnimationFrame(() => setFocus('title'));
  }

  function cancel() {
    reset({ boardId, title: '' });
    setFormError(null);
    setOpen(false);
  }

  async function onSubmit(values: CreateListInput) {
    setFormError(null);
    try {
      await createList(values);
      reset({ boardId, title: '' });
      setOpen(false);
    } catch {
      setFormError('Could not add the list. Please try again.');
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={openForm}
        className="flex w-64 shrink-0 items-center gap-2 rounded-xl border border-dashed border-border p-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Plus className="size-4" />
        Add a list
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-64 shrink-0 flex-col gap-2 rounded-xl bg-muted/40 p-3"
      noValidate
    >
      <input type="hidden" {...register('boardId')} />
      <Input
        placeholder="List title"
        aria-invalid={!!errors.title}
        {...register('title')}
      />
      {errors.title && (
        <p className="text-xs text-destructive">{errors.title.message}</p>
      )}
      {formError && <p className="text-xs text-destructive">{formError}</p>}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Add list
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
