'use client';

import { useState, useTransition } from 'react';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
} from 'lucide-react';

import { renameList, deleteList } from '@/lib/boards/actions';
import { AddCardForm } from '@/components/board/card/add-card-form';
import { useBoardContext } from '@/components/board/board-context';
import { useInlineRename } from '@/components/board/use-inline-rename';
import { cn } from '@/lib/utils';
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
  dragHandle,
  highlighted,
  children,
}: {
  list: ListWithCards;
  dragHandle?: React.ReactNode;
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  const { canEdit } = useBoardContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { editing, startEditing, cancelEditing, optimisticTitle, submit } =
    useInlineRename(list.title, (title) =>
      renameList({ listId: list.id, title })
    );

  return (
    <div
      className={cn(
        'flex w-64 shrink-0 flex-col gap-2.5 rounded-xl p-1.5 transition-colors',
        highlighted && 'bg-primary/10'
      )}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        {editing ? (
          <form
            className="flex w-full items-center gap-1"
            onSubmit={(event) => {
              event.preventDefault();
              submit(
                new FormData(event.currentTarget).get('title')?.toString()
              );
            }}
          >
            <Input
              name="title"
              defaultValue={list.title}
              autoFocus
              className="h-8"
              onKeyDown={(event) => {
                if (event.key === 'Escape') cancelEditing();
              }}
            />
            <Button
              type="submit"
              size="icon-sm"
              variant="ghost"
              aria-label="Save list name"
              className="text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Check className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={cancelEditing}
              aria-label="Cancel"
              className="text-muted-foreground hover:bg-destructive hover:text-white"
            >
              <X className="size-4" />
            </Button>
          </form>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-1">
              {dragHandle}
              <span className="truncate text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {optimisticTitle}
              </span>
            </div>
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
                    <DropdownMenuItem onSelect={() => startEditing()}>
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

      {list.cards.length > 0 && (
        <div className="flex flex-col gap-2">{children}</div>
      )}

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
