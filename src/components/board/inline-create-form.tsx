'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type InlineCreateFormProps = {
  onCreateAction: (title: string) => Promise<unknown>;
  triggerLabel: string;
  submitLabel: string;
  placeholder: string;
  errorText: string;
  maxLength: number;
  triggerClassName: string;
  formClassName: string;
};

export function InlineCreateForm({
  onCreateAction,
  triggerLabel,
  submitLabel,
  placeholder,
  errorText,
  maxLength,
  triggerClassName,
  formClassName,
}: InlineCreateFormProps) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, 'Title is required')
      .max(maxLength, 'Title is too long'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<{ title: string }>({
    resolver: zodResolver(schema),
    defaultValues: { title: '' },
  });

  function openForm() {
    setOpen(true);
    requestAnimationFrame(() => setFocus('title'));
  }

  function cancel() {
    reset({ title: '' });
    setFormError(null);
    setOpen(false);
  }

  async function onSubmit(values: { title: string }) {
    setFormError(null);
    try {
      await onCreateAction(values.title);
      reset({ title: '' });
      setOpen(false);
    } catch {
      setFormError(errorText);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={openForm} className={triggerClassName}>
        <Plus className="size-4" />
        {triggerLabel}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={formClassName}
      noValidate
    >
      <Input
        placeholder={placeholder}
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
          {submitLabel}
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
