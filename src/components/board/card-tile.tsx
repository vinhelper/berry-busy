import { Clock, MessageSquare, Paperclip } from 'lucide-react';

import { AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/user-avatar';
import type { CardWithRelations } from '@/lib/boards/queries';

const dueDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export function CardTile({ card }: { card: CardWithRelations }) {
  const hasFooter =
    !!card.dueDate ||
    card._count.comments > 0 ||
    card._count.attachments > 0 ||
    card.assignees.length > 0;

  return (
    <Card size="sm" className="gap-2 shadow-sm ring-foreground/5">
      <CardContent className="flex flex-col gap-2">
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.labels.map(({ label }) => (
              <span
                key={label.id}
                className="h-1.5 w-8 rounded-full"
                style={{ backgroundColor: label.color }}
                title={label.name}
              />
            ))}
          </div>
        )}

        <p className="text-sm leading-snug font-medium">{card.title}</p>

        {hasFooter && (
          <div className="flex items-center justify-between pt-0.5 text-muted-foreground">
            <div className="flex items-center gap-2.5 text-xs">
              {card.dueDate && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {dueDateFormatter.format(card.dueDate)}
                </span>
              )}
              {card._count.comments > 0 && (
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="size-3.5" />
                  {card._count.comments}
                </span>
              )}
              {card._count.attachments > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Paperclip className="size-3.5" />
                  {card._count.attachments}
                </span>
              )}
            </div>

            {card.assignees.length > 0 && (
              <AvatarGroup className="-space-x-1.5">
                {card.assignees.slice(0, 3).map(({ user }) => (
                  <UserAvatar key={user.id} user={user} size="sm" />
                ))}
                {card.assignees.length > 3 && (
                  <AvatarGroupCount className="size-6 text-[10px]">
                    +{card.assignees.length - 3}
                  </AvatarGroupCount>
                )}
              </AvatarGroup>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
