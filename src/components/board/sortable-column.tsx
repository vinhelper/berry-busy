'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { BoardColumn } from '@/components/board/board-column';
import { SortableCardList } from '@/components/board/sortable-card-list';
import type { ListWithCards } from '@/lib/boards/queries';

export function SortableColumn({
  list,
  highlighted,
}: {
  list: ListWithCards;
  highlighted?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id, data: { type: 'list' } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="shrink-0">
      <BoardColumn
        list={list}
        highlighted={highlighted}
        dragHandle={
          <button
            type="button"
            aria-label="Drag to reorder list"
            className="-ml-1 flex size-6 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        }
      >
        <SortableCardList list={list} />
      </BoardColumn>
    </div>
  );
}
