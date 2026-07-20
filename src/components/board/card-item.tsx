'use client';

import { useState, useTransition } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';

import { renameCard, deleteCard } from '@/lib/boards/actions';
import { CardTile } from '@/components/board/card-tile';
import { useInlineRename } from '@/components/board/use-inline-rename';
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
  listId,
}: {
  card: CardWithRelations;
  listId: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { editing, startEditing, cancelEditing, optimisticTitle, submit } =
    useInlineRename(card.title, (title) =>
      renameCard({ cardId: card.id, title })
    );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', listId },
    disabled: editing,
  });

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : undefined,
  };

  if (editing) {
    return (
      <form
        ref={setNodeRef}
        style={style}
        onSubmit={(event) => {
          event.preventDefault();
          submit(new FormData(event.currentTarget).get('title')?.toString());
        }}
        className="flex flex-col gap-2 rounded-lg border bg-card p-2 shadow-sm ring-1 ring-foreground/5"
      >
        <Input
          name="title"
          defaultValue={card.title}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Escape') cancelEditing();
          }}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={cancelEditing}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none active:cursor-grabbing"
      >
        <CardTile card={{ ...card, title: optimisticTitle }} />
      </div>

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
          <DropdownMenuItem onSelect={() => startEditing()}>
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
