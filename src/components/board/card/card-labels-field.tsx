'use client';

import { useState, useTransition } from 'react';
import { Loader2, Plus } from 'lucide-react';

import { createLabel } from '@/lib/boards/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { BoardLabel } from '@/lib/boards/queries';

const LABEL_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

export function CardLabelsField({
  boardId,
  labels,
  selected,
  onToggle,
  onSelect,
  canEdit,
}: {
  boardId: string;
  labels: BoardLabel[];
  selected: string[];
  onToggle: (labelId: string) => void;
  onSelect: (labelId: string) => void;
  canEdit: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(LABEL_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      try {
        const { id } = await createLabel({ boardId, name: trimmed, color });
        onSelect(id);
        setName('');
        setColor(LABEL_COLORS[0]);
        setCreating(false);
      } catch {
        setError('Could not create the label. The name may already exist.');
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">Labels</span>

      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {labels.map((label) => {
            const on = selected.includes(label.id);
            return (
              <button
                key={label.id}
                type="button"
                disabled={!canEdit}
                onClick={() => onToggle(label.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs transition-colors disabled:opacity-100',
                  on ? 'border-transparent text-white' : 'hover:bg-muted'
                )}
                style={
                  on
                    ? { backgroundColor: label.color }
                    : { borderColor: label.color }
                }
              >
                {!on && (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                )}
                {label.name}
              </button>
            );
          })}
        </div>
      )}

      {canEdit &&
        (creating ? (
          <div className="flex flex-col gap-2 rounded-md border p-2">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Label name"
              autoFocus
              maxLength={50}
              className="h-8"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleCreate();
                }
              }}
            />
            <div className="flex flex-wrap gap-1.5">
              {LABEL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Use color ${c}`}
                  className={cn(
                    'size-6 rounded-full transition-transform',
                    color === c && 'ring-2 ring-ring ring-offset-1'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleCreate}
                disabled={pending || !name.trim()}
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                Add label
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setCreating(false);
                  setName('');
                  setError(null);
                }}
                disabled={pending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Plus className="size-3.5" />
            New label
          </button>
        ))}
    </div>
  );
}
