'use client';

import { useState, useTransition } from 'react';
import { MoreHorizontal, Pencil, Trash2, Loader2, Check, X } from 'lucide-react';

import { renameList, deleteList } from '@/lib/boards/actions';
import { CardItem } from '@/components/board/card-item';
import { AddCardForm } from '@/components/board/add-card-form';
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
import type { ListWithCards } from '@/lib/boards/queries';

export function BoardColumn({
  list,
  canEdit,
}: {
  list: ListWithCards;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex w-64 shrink-0 flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 px-1">
        {editing ? (
          <form
            className="flex w-full items-center gap-1"
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
                  await renameList({ listId: list.id, title });
                } finally {
                  setEditing(false);
                }
              });
            }}
          >
            <Input
              name="title"
              defaultValue={list.title}
              autoFocus
              disabled={pending}
              className="h-8"
              onKeyDown={(event) => {
                if (event.key === 'Escape') setEditing(false);
              }}
            />
            <Button
              type="submit"
              size="icon-sm"
              variant="ghost"
              disabled={pending}
              aria-label="Save list name"
              className="text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setEditing(false)}
              disabled={pending}
              aria-label="Cancel"
              className="text-muted-foreground hover:bg-destructive hover:text-white"
            >
              <X className="size-4" />
            </Button>
          </form>
        ) : (
          <>
            <span className="truncate text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {list.title}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {list.cards.length}
              </span>
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="List actions"
                      className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted"
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
                      Delete list
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {list.cards.map((card) => (
          <CardItem key={card.id} card={card} canEdit={canEdit} />
        ))}
      </div>

      {canEdit && <AddCardForm listId={list.id} />}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{list.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the list and its {list.cards.length}{' '}
              {list.cards.length === 1 ? 'card' : 'cards'}. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await deleteList(list.id);
                  setConfirmOpen(false);
                })
              }
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Delete list
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
