'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Loader2, X } from 'lucide-react';

import { updateCard } from '@/lib/boards/actions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CardLabelsField } from '@/components/board/card/card-labels-field';
import { CardAssigneesField } from '@/components/board/card/card-assignees-field';
import { CardComments } from '@/components/board/card/card-comments';
import { cn } from '@/lib/utils';
import type { CardDetailData } from '@/lib/boards/queries';

function ymdFromUtc(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}
function ymdToLocalDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function ymdFromLocalDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const dueLabelFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function CardDetail({
  card,
  canEdit,
  currentUserId,
  isOwner,
  variant,
}: {
  card: CardDetailData;
  canEdit: boolean;
  currentUserId: string;
  isOwner: boolean;
  variant: 'page' | 'modal';
}) {
  const router = useRouter();
  const boardId = card.list.board.id;
  const boardLabels = card.list.board.labels;
  const members = card.list.board.members;

  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? '');
  const [due, setDue] = useState(card.dueDate ? ymdFromUtc(card.dueDate) : '');
  const [labelIds, setLabelIds] = useState<string[]>(
    card.labels.map((cardLabel) => cardLabel.label.id)
  );
  const [assigneeIds, setAssigneeIds] = useState<string[]>(
    card.assignees.map((assignee) => assignee.user.id)
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedTitle = title.trim();

  function close() {
    if (variant === 'modal') router.back();
    else router.push(`/boards/${boardId}`);
  }

  function toggleLabel(labelId: string) {
    setLabelIds((ids) =>
      ids.includes(labelId)
        ? ids.filter((id) => id !== labelId)
        : [...ids, labelId]
    );
  }

  function selectLabel(labelId: string) {
    setLabelIds((ids) => (ids.includes(labelId) ? ids : [...ids, labelId]));
  }

  function toggleAssignee(userId: string) {
    setAssigneeIds((ids) =>
      ids.includes(userId)
        ? ids.filter((id) => id !== userId)
        : [...ids, userId]
    );
  }

  function handleSave() {
    if (!trimmedTitle) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateCard({
          cardId: card.id,
          title: trimmedTitle,
          description: description.trim(),
          dueDate: due || null,
          labelIds,
          assigneeIds,
        });
        if (variant === 'modal') router.back();
        else router.refresh();
      } catch {
        setError('Could not save the card. Please try again.');
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          readOnly={!canEdit}
          aria-label="Card title"
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault();
          }}
          className={cn(
            'h-8 flex-1 rounded-md border border-transparent bg-transparent pr-1 font-heading text-base font-semibold tracking-tight outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
            canEdit ? 'hover:bg-muted/50' : 'cursor-default'
          )}
        />
        {variant === 'modal' && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={close}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[1.7fr_1fr]">
        {/* Main column: description + discussion */}
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Description
            </span>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              readOnly={!canEdit}
              placeholder={
                canEdit ? 'Add a more detailed description…' : 'No description.'
              }
              className="min-h-28"
            />
          </div>

          <CardComments
            cardId={card.id}
            initialComments={card.comments}
            currentUserId={currentUserId}
            isOwner={isOwner}
            canComment={canEdit}
          />
        </div>

        {/* Sidebar: card properties + actions */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Due date
            </span>
            <div className="flex items-center gap-2">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!canEdit}
                    className="justify-start font-normal"
                  >
                    <CalendarIcon className="size-4" />
                    {due
                      ? dueLabelFormatter.format(ymdToLocalDate(due))
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    required
                    selected={due ? ymdToLocalDate(due) : undefined}
                    onSelect={(date) => {
                      setDue(ymdFromLocalDate(date));
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {canEdit && due && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDue('')}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <CardLabelsField
            boardId={boardId}
            labels={boardLabels}
            selected={labelIds}
            onToggle={toggleLabel}
            onSelect={selectLabel}
            canEdit={canEdit}
          />

          {members.length > 0 && (
            <CardAssigneesField
              members={members}
              selected={assigneeIds}
              onToggle={toggleAssignee}
              canEdit={canEdit}
            />
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {canEdit && (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={close}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={pending || !trimmedTitle}
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
