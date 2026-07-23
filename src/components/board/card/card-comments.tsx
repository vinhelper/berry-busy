'use client';

import { useState, useTransition } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

import { addComment, deleteComment } from '@/lib/boards/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/user-avatar';
import type { CardDetailComment } from '@/lib/boards/queries';

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function CardComments({
  cardId,
  initialComments,
  currentUserId,
  isOwner,
  canComment,
}: {
  cardId: string;
  initialComments: CardDetailComment[];
  currentUserId: string;
  isOwner: boolean;
  canComment: boolean;
}) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    const trimmed = content.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      try {
        const created = await addComment({ cardId, content: trimmed });
        setComments((prev) => [created, ...prev]);
        setContent('');
      } catch {
        setError('Could not post your comment. Please try again.');
      }
    });
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await deleteComment(id);
        setComments((prev) => prev.filter((c) => c.id !== id));
      } catch {
        setError('Could not delete the comment. Please try again.');
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      <span className="text-xs font-medium text-muted-foreground">
        Comments
      </span>

      {canComment && (
        <div className="flex flex-col items-end gap-2">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a comment…"
            className="min-h-16"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={pending || !content.trim()}
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Comment
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      {comments.length > 0 && (
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => {
            const canDelete =
              canComment && (comment.user.id === currentUserId || isOwner);
            return (
              <li key={comment.id} className="flex gap-2.5">
                <UserAvatar user={comment.user} size="sm" className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {timeFormatter.format(comment.createdAt)}
                    </span>
                    {canDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Delete comment"
                        disabled={pending}
                        onClick={() => handleDelete(comment.id)}
                        className="ml-auto size-6 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-foreground/90">
                    {comment.content}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
