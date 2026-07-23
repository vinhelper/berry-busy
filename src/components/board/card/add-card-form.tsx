'use client';

import { createCard } from '@/lib/boards/actions';
import { InlineCreateForm } from '@/components/board/inline-create-form';

export function AddCardForm({ listId }: { listId: string }) {
  return (
    <InlineCreateForm
      onCreateAction={(title) => createCard({ listId, title })}
      triggerLabel="Add a card"
      submitLabel="Add card"
      placeholder="Card title"
      errorText="Could not add the card. Please try again."
      maxLength={200}
      triggerClassName="flex items-center gap-1.5 rounded-md px-1 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
      formClassName="flex flex-col gap-2"
    />
  );
}
