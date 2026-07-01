import { Check, Clock, MessageSquare, Paperclip } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const labelColors: Record<string, string> = {
  design: 'oklch(0.62 0.17 340)',
  backend: 'oklch(0.6 0.16 250)',
  ux: 'oklch(0.7 0.13 190)',
  perf: 'oklch(0.72 0.16 60)',
  infra: 'oklch(0.6 0.2 25)',
};

const people: Record<string, string> = {
  AM: 'oklch(0.52 0.2 285)',
  JP: 'oklch(0.6 0.16 250)',
  SK: 'oklch(0.62 0.17 340)',
  TL: 'oklch(0.7 0.13 190)',
};

type Task = {
  title: string;
  labels: string[];
  who: string[];
  due?: string;
  dueSoon?: boolean;
  comments?: number;
  attachments?: number;
  done?: boolean;
};

const columns: { name: string; tasks: Task[] }[] = [
  {
    name: 'This week',
    tasks: [
      {
        title: 'Redesign the empty-board state',
        labels: ['design', 'ux'],
        who: ['AM', 'SK'],
        due: 'Thu',
        comments: 3,
      },
      {
        title: 'Invite teammates with a share link',
        labels: ['backend'],
        who: ['JP'],
        attachments: 1,
      },
    ],
  },
  {
    name: 'In progress',
    tasks: [
      {
        title: 'Drag-and-drop card reordering',
        labels: ['ux'],
        who: ['AM'],
        due: 'Today',
        dueSoon: true,
        comments: 5,
        attachments: 2,
      },
      {
        title: 'Board roles: owner, editor, viewer',
        labels: ['backend'],
        who: ['JP', 'TL'],
      },
    ],
  },
  {
    name: 'In review',
    tasks: [
      {
        title: 'Activity-log timeline',
        labels: ['design'],
        who: ['SK'],
        comments: 2,
      },
    ],
  },
  {
    name: 'Shipped',
    tasks: [
      {
        title: 'OKLCH colour tokens',
        labels: ['design'],
        who: ['SK'],
        done: true,
      },
      {
        title: 'Neon Postgres + connection pooling',
        labels: ['backend', 'perf'],
        who: ['JP'],
        done: true,
      },
    ],
  },
];

function TaskCard({ task }: { task: Task }) {
  return (
    <Card
      size="sm"
      className={cn(
        'gap-2 shadow-sm ring-foreground/5',
        task.done && 'opacity-60'
      )}
    >
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-1">
          {task.labels.map((l) => (
            <span
              key={l}
              className="h-1.5 w-8 rounded-full"
              style={{ backgroundColor: labelColors[l] }}
              title={l}
            />
          ))}
        </div>

        <p
          className={cn(
            'text-sm leading-snug font-medium',
            task.done && 'line-through decoration-muted-foreground/40'
          )}
        >
          {task.title}
        </p>

        <div className="flex items-center justify-between pt-0.5 text-muted-foreground">
          <div className="flex items-center gap-2.5 text-xs">
            {task.done ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <Check className="size-3.5" /> Done
              </span>
            ) : task.due ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1',
                  task.dueSoon && 'font-medium text-destructive'
                )}
              >
                <Clock className="size-3.5" />
                {task.due}
              </span>
            ) : null}
            {task.comments ? (
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="size-3.5" />
                {task.comments}
              </span>
            ) : null}
            {task.attachments ? (
              <span className="inline-flex items-center gap-1">
                <Paperclip className="size-3.5" />
                {task.attachments}
              </span>
            ) : null}
          </div>

          <AvatarGroup className="-space-x-1.5">
            {task.who.map((p) => (
              <Avatar key={p} size="sm">
                <AvatarFallback
                  className="text-[10px] font-medium text-white"
                  style={{ backgroundColor: people[p] }}
                >
                  {p}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export function BoardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-primary/5 ring-1 ring-foreground/5">
      {/* board bar */}
      <div className="flex items-center justify-between gap-4 border-b bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="text-sm font-medium">Product roadmap</span>
          <Badge variant="outline" className="hidden sm:inline-flex">
            12 cards
          </Badge>
        </div>
        <AvatarGroup>
          {(['AM', 'JP', 'SK'] as const).map((p) => (
            <Avatar key={p} size="sm">
              <AvatarFallback
                className="text-[10px] font-medium text-white"
                style={{ backgroundColor: people[p] }}
              >
                {p}
              </AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount className="size-6 text-[10px]">+2</AvatarGroupCount>
        </AvatarGroup>
      </div>

      {/* columns */}
      <div className="flex gap-3 overflow-x-auto bg-linear-to-b from-muted/20 to-transparent p-4">
        {columns.map((col) => (
          <div key={col.name} className="flex w-60 shrink-0 flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {col.name}
              </span>
              <span className="text-xs text-muted-foreground/70">
                {col.tasks.length}
              </span>
            </div>
            {col.tasks.map((task) => (
              <TaskCard key={task.title} task={task} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
