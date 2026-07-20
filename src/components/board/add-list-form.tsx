'use client';

import { createList } from '@/lib/boards/actions';
import { InlineCreateForm } from '@/components/board/inline-create-form';

export function AddListForm({ boardId }: { boardId: string }) {
  return (
    <InlineCreateForm
      onCreateAction={(title) => createList({ boardId, title })}
      triggerLabel="Add a list"
      submitLabel="Add list"
      placeholder="List title"
      errorText="Could not add the list. Please try again."
      maxLength={120}
      triggerClassName="flex w-64 shrink-0 items-center gap-2 rounded-xl border border-dashed border-border p-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      formClassName="flex w-64 shrink-0 flex-col gap-2 rounded-xl bg-muted/40 p-3"
    />
  );
}
