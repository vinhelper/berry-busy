'use client';

import { createContext, useContext } from 'react';

export type BoardContextValue = {
  boardId: string;
  canEdit: boolean;
};

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({
  value,
  children,
}: {
  value: BoardContextValue;
  children: React.ReactNode;
}) {
  return <BoardContext value={value}>{children}</BoardContext>;
}

export function useBoardContext() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
}
