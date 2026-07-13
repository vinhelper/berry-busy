'use client';

import { useState, useTransition } from 'react';
import { MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';

import { renameCard, deleteCard } from '@/lib/boards/actions';
import { CardTile } from '@/components/board/card-tile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { CardWithRelations } from '@/lib/boards/queries';

export function CardItem({
  card,
  canEdit,
}: {
  card: CardWithRelations;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!canEdit) {
    return <CardTile card={card} />;
  }

  if (editing) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = new FormData(event.currentTarget)
            .get('title')
            ?.toString()
            .trim();
          if (!title) {
            setEditing(false);
            return;
          }
          startTransition(async () => {
            try {
              await renameCard({ cardId: card.id, title });
            } finally {
              setEditing(false);
            }
          });
        }}
        className="flex flex-col gap-2 rounded-lg border bg-card p-2 shadow-sm ring-1 ring-foreground/5"
      >
        <Input
          name="title"
          defaultValue={card.title}
          autoFocus
          disabled={pending}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setEditing(false);
          }}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setEditing(false)}
            disabled={pending}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="group relative">
      <CardTile card={card} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Card actions"
            className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditing(true)}>
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this card?</AlertDialogTitle>
            <AlertDialogDescription>
              “{card.title}” will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await deleteCard(card.id);
                  setConfirmOpen(false);
                })
              }
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Delete card
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
