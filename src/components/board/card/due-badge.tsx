'use client';

import { useSyncExternalStore } from 'react';
import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';

const absoluteFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  timeZone: 'UTC',
});

function subscribe() {
  return () => {};
}
function getTodayKey(): number {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}
function getServerTodayKey(): number | null {
  return null;
}

type DueDisplay = { text: string; overdue: boolean };

function describe(dueDate: Date, todayKey: number | null): DueDisplay {
  if (todayKey === null) {
    return { text: absoluteFormatter.format(dueDate), overdue: false };
  }
  const dueKey = Date.UTC(
    dueDate.getUTCFullYear(),
    dueDate.getUTCMonth(),
    dueDate.getUTCDate()
  );
  const diffDays = Math.round((dueKey - todayKey) / 86_400_000);

  if (diffDays < 0) return { text: 'Overdue', overdue: true };
  if (diffDays === 0) return { text: 'Today', overdue: true };
  if (diffDays <= 6)
    return { text: weekdayFormatter.format(dueDate), overdue: false };
  return { text: absoluteFormatter.format(dueDate), overdue: false };
}

export function DueBadge({ dueDate }: { dueDate: Date }) {
  const todayKey = useSyncExternalStore(
    subscribe,
    getTodayKey,
    getServerTodayKey
  );
  const { text, overdue } = describe(dueDate, todayKey);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        overdue && 'font-medium text-destructive'
      )}
    >
      <Clock className="size-3.5" />
      {text}
    </span>
  );
}
