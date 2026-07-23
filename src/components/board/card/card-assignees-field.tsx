'use client';

import { Check } from 'lucide-react';

import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';
import type { BoardMemberWithUser } from '@/lib/boards/queries';

export function CardAssigneesField({
  members,
  selected,
  onToggle,
  canEdit,
}: {
  members: BoardMemberWithUser[];
  selected: string[];
  onToggle: (userId: string) => void;
  canEdit: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        Assignees
      </span>
      <div className="flex flex-wrap gap-1.5">
        {members.map(({ user }) => {
          const on = selected.includes(user.id);
          return (
            <button
              key={user.id}
              type="button"
              disabled={!canEdit}
              onClick={() => onToggle(user.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border py-0.5 pr-2 pl-0.5 text-xs transition-colors',
                on
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-muted'
              )}
            >
              <UserAvatar user={user} size="sm" />
              {user.name}
              {on && <Check className="size-3.5 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
