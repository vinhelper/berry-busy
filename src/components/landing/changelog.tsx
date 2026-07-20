import { Check, Circle, CircleDashed } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const status = {
  shipped: { icon: Check, className: 'text-primary', label: 'Shipped' },
  progress: {
    icon: CircleDashed,
    className: 'text-muted-foreground',
    label: 'In progress',
  },
  planned: {
    icon: Circle,
    className: 'text-muted-foreground/50',
    label: 'Planned',
  },
} as const;

const changelog: {
  title: string;
  state: keyof typeof status;
  when?: string;
}[] = [
  { title: 'OKLCH colour tokens', state: 'shipped', when: 'Jun' },
  { title: 'Board roles & permissions', state: 'shipped', when: 'Jun' },
  { title: 'Activity-log timeline', state: 'shipped', when: 'May' },
  { title: 'Comments on cards', state: 'shipped', when: 'May' },
  { title: 'Trello board import', state: 'progress' },
  { title: 'Calendar & due-date view', state: 'planned' },
];

export function Changelog() {
  return (
    <section id="changelog" className="border-t bg-muted/30 py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
        <div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">
            Built in the open.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            BerryBusy is early, and we would rather show you where it stands
            than pretend it is finished. If it says shipped, it is in the app
            you are looking at right now.
          </p>
          <p className="mt-4 text-muted-foreground">
            Something usually lands most weeks. When it breaks, that is usually
            in the open too.
          </p>
        </div>

        <Card className="gap-0 p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-medium">Recently shipped</span>
            <Badge variant="secondary">beta</Badge>
          </div>
          <Separator />
          <ul className="divide-y divide-border">
            {changelog.map((item) => {
              const { icon: Icon, className, label } = status[item.state];
              return (
                <li
                  key={item.title}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <Icon className={cn('size-4 shrink-0', className)} />
                  <span
                    className={cn(
                      'flex-1 text-sm',
                      item.state === 'planned' && 'text-muted-foreground'
                    )}
                  >
                    {item.title}
                  </span>
                  {item.when ? (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {item.when}
                    </span>
                  ) : (
                    <Badge variant="outline">{label}</Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </section>
  );
}
