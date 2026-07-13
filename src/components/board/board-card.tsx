'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

import { deleteBoard } from '@/lib/boards/actions';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type BoardCardProps = {
  board: {
    id: string;
    title: string;
    description: string | null;
    listCount: number;
  };
};

export function BoardCard({ board }: BoardCardProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      await deleteBoard(board.id);
      setOpen(false);
    });
  }

  return (
    <div className="group relative">
      <Link
        href={`/boards/${board.id}`}
        className="flex min-h-32 flex-col rounded-xl border bg-card p-4 ring-1 ring-foreground/5 transition-colors hover:border-primary/40"
      >
        <h3 className="truncate pr-6 font-medium">{board.title}</h3>
        {board.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {board.description}
          </p>
        )}
        <p className="mt-auto pt-4 text-xs text-muted-foreground">
          {board.listCount} {board.listCount === 1 ? 'list' : 'lists'}
        </p>
      </Link>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${board.title}`}
        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{board.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the board along with its lists and cards.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={pending}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Delete board
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
