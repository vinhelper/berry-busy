'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import { reorderList, moveCard } from '@/lib/boards/actions';
import { useBoardStore } from '@/stores/board-store';
import { BoardColumn } from '@/components/board/board-column';
import { SortableColumn } from '@/components/board/sortable-column';
import { CardTile } from '@/components/board/card/card-tile';
import { AddListForm } from '@/components/board/add-list-form';
import {
  BoardProvider,
  useBoardContext,
  type BoardContextValue,
} from '@/components/board/board-context';
import type { ListWithCards } from '@/lib/boards/queries';

const COLUMNS_CLASS =
  'flex items-start gap-3 overflow-x-auto bg-linear-to-b from-muted/20 to-transparent p-4';

const collisionDetection: CollisionDetection = (args) => {
  if (args.active.data.current?.type === 'list') {
    return closestCorners({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (container) => container.data.current?.type === 'list'
      ),
    });
  }
  return closestCorners(args);
};

export function BoardCanvas({
  lists,
  boardId,
  canEdit,
}: {
  lists: ListWithCards[];
} & BoardContextValue) {
  const contextValue: BoardContextValue = { boardId, canEdit };

  return (
    <BoardProvider value={contextValue}>
      {canEdit ? (
        <EditableCanvas serverLists={lists} />
      ) : (
        <div className={COLUMNS_CLASS}>
          {lists.map((list) => (
            <BoardColumn key={list.id} list={list}>
              {list.cards.map((card) => (
                <CardTile key={card.id} card={card} />
              ))}
            </BoardColumn>
          ))}
          {lists.length === 0 && (
            <p className="px-2 py-6 text-sm text-muted-foreground">
              This board is empty.
            </p>
          )}
        </div>
      )}
    </BoardProvider>
  );
}

function findListId(lists: ListWithCards[], id: string) {
  if (lists.some((l) => l.id === id)) return id;
  return lists.find((l) => l.cards.some((c) => c.id === id))?.id;
}

function reorderLists(
  lists: ListWithCards[],
  activeId: string,
  overListId: string
) {
  const from = lists.findIndex((l) => l.id === activeId);
  const to = lists.findIndex((l) => l.id === overListId);
  if (from < 0 || to < 0 || from === to) return null;
  const next = arrayMove(lists, from, to);
  return {
    next,
    beforeId: next[to - 1]?.id ?? null,
    afterId: next[to + 1]?.id ?? null,
  };
}

function moveCardBetween(
  lists: ListWithCards[],
  cardId: string,
  fromListId: string,
  toListId: string,
  overCardId: string | null
) {
  const fromIdx = lists.findIndex((l) => l.id === fromListId);
  const toIdx = lists.findIndex((l) => l.id === toListId);
  if (fromIdx < 0 || toIdx < 0) return lists;
  const card = lists[fromIdx].cards.find((c) => c.id === cardId);
  if (!card) return lists;

  const next = lists.map((l) => ({ ...l, cards: [...l.cards] }));
  next[fromIdx].cards = next[fromIdx].cards.filter((c) => c.id !== cardId);

  const targetCards = next[toIdx].cards;
  let insertAt = targetCards.length;
  if (overCardId) {
    const oi = targetCards.findIndex((c) => c.id === overCardId);
    if (oi >= 0) insertAt = oi;
  }
  targetCards.splice(insertAt, 0, { ...card, listId: toListId });
  return next;
}

function reorderCardWithin(
  lists: ListWithCards[],
  listId: string,
  activeCardId: string,
  overCardId: string
) {
  const li = lists.findIndex((l) => l.id === listId);
  if (li < 0) return lists;
  const cards = lists[li].cards;
  const oldIndex = cards.findIndex((c) => c.id === activeCardId);
  const newIndex = cards.findIndex((c) => c.id === overCardId);
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return lists;
  return lists.map((l, i) =>
    i === li ? { ...l, cards: arrayMove(l.cards, oldIndex, newIndex) } : l
  );
}

function neighbours(lists: ListWithCards[], listId: string, cardId: string) {
  const list = lists.find((l) => l.id === listId);
  const idx = list?.cards.findIndex((c) => c.id === cardId) ?? -1;
  return {
    beforeId: idx > 0 ? (list!.cards[idx - 1]?.id ?? null) : null,
    afterId: idx >= 0 ? (list!.cards[idx + 1]?.id ?? null) : null,
  };
}

function EditableCanvas({ serverLists }: { serverLists: ListWithCards[] }) {
  const { boardId } = useBoardContext();
  const override = useBoardStore((s) => s.override);
  const overrideBoardId = useBoardStore((s) => s.overrideBoardId);
  const setOverride = useBoardStore((s) => s.setOverride);
  const clear = useBoardStore((s) => s.clear);

  const [activeDrag, setActiveDrag] = useState<{
    id: string;
    type: 'card' | 'list';
  } | null>(null);

  const [overListId, setOverListId] = useState<string | null>(null);

  useEffect(() => {
    clear();
  }, [serverLists, clear]);

  const lists =
    override && overrideBoardId === boardId ? override : serverLists;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function resetDrag() {
    setActiveDrag(null);
    setOverListId(null);
  }

  function handleDragStart(event: DragStartEvent) {
    const type = event.active.data.current?.type;
    if (type === 'card' || type === 'list') {
      setActiveDrag({ id: String(event.active.id), type });
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.data.current?.type !== 'card') return;

    const working = useBoardStore.getState().override ?? serverLists;
    const activeListId = findListId(working, String(active.id));
    const overListId =
      over.data.current?.type === 'card'
        ? findListId(working, String(over.id))
        : String(over.id);
    if (!activeListId || !overListId) return;

    setOverListId(overListId);
    if (activeListId === overListId) return;

    const overCardId =
      over.data.current?.type === 'card' ? String(over.id) : null;
    setOverride(
      boardId,
      moveCardBetween(
        working,
        String(active.id),
        activeListId,
        overListId,
        overCardId
      )
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const type = activeDrag?.type;
    resetDrag();
    if (!over) {
      clear();
      return;
    }

    const working = useBoardStore.getState().override ?? serverLists;

    if (type === 'list') {
      const overListId =
        over.data.current?.type === 'list'
          ? String(over.id)
          : findListId(working, String(over.id));
      if (!overListId || overListId === String(active.id)) {
        clear();
        return;
      }
      const result = reorderLists(working, String(active.id), overListId);
      if (!result) {
        clear();
        return;
      }
      setOverride(boardId, result.next);
      reorderList({
        listId: String(active.id),
        beforeId: result.beforeId,
        afterId: result.afterId,
      }).catch(() => clear());
      return;
    }

    const cardId = String(active.id);
    const listId = findListId(working, cardId);
    if (!listId) {
      clear();
      return;
    }

    let finalLists = working;
    if (over.data.current?.type === 'card' && String(over.id) !== cardId) {
      const overListId = findListId(working, String(over.id));
      if (overListId === listId) {
        finalLists = reorderCardWithin(
          working,
          listId,
          cardId,
          String(over.id)
        );
      }
    }

    const { beforeId, afterId } = neighbours(finalLists, listId, cardId);

    const startListId = findListId(serverLists, cardId);
    if (startListId) {
      const start = neighbours(serverLists, startListId, cardId);
      if (
        listId === startListId &&
        beforeId === start.beforeId &&
        afterId === start.afterId
      ) {
        clear();
        return;
      }
    }

    setOverride(boardId, finalLists);
    moveCard({ cardId, toListId: listId, beforeId, afterId }).catch(() =>
      clear()
    );
  }

  const activeCard =
    activeDrag?.type === 'card'
      ? lists.flatMap((l) => l.cards).find((c) => c.id === activeDrag.id)
      : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        resetDrag();
        clear();
      }}
    >
      <div className={COLUMNS_CLASS}>
        <SortableContext
          items={lists.map((l) => l.id)}
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list) => (
            <SortableColumn
              key={list.id}
              list={list}
              highlighted={
                activeDrag?.type === 'card' && overListId === list.id
              }
            />
          ))}
        </SortableContext>
        <AddListForm boardId={boardId} />
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="w-64 rotate-2 cursor-grabbing">
            <CardTile card={activeCard} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
