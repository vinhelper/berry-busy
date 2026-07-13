'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';

import { createCard } from '@/lib/boards/actions';
import { createCardSchema, type CreateCardInput } from '@/lib/validations/board';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AddCardForm({ listId }: { listId: string }) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CreateCardInput>({
    resolver: zodResolver(createCardSchema),
    defaultValues: { listId, title: '' },
  });

  function openForm() {
    setOpen(true);
    requestAnimationFrame(() => setFocus('title'));
  }

  function cancel() {
    reset({ listId, title: '' });
    setFormError(null);
    setOpen(false);
  }

  async function onSubmit(values: CreateCardInput) {
    setFormError(null);
    try {
      await createCard(values);
      reset({ listId, title: '' });
      setOpen(false);
    } catch {
      setFormError('Could not add the card. Please try again.');
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={openForm}
        className="flex items-center gap-1.5 rounded-md px-1 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plus className="size-4" />
        Add a card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
      <input type="hidden" {...register('listId')} />
      <Input
        placeholder="Card title"
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
          Add card
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
