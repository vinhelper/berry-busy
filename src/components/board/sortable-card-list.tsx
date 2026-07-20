'use client';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CardItem } from '@/components/board/card-item';
import type { ListWithCards } from '@/lib/boards/queries';

export function SortableCardList({ list }: { list: ListWithCards }) {
  return (
    <SortableContext
      items={list.cards.map((card) => card.id)}
      strategy={verticalListSortingStrategy}
    >
      {list.cards.map((card) => (
        <CardItem key={card.id} card={card} listId={list.id} />
      ))}
    </SortableContext>
  );
}
