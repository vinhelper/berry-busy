import { create } from 'zustand';

import type { ListWithCards } from '@/lib/boards/queries';

type BoardStore = {
  overrideBoardId: string | null;
  override: ListWithCards[] | null;
  setOverride: (boardId: string, lists: ListWithCards[]) => void;
  clear: () => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  overrideBoardId: null,
  override: null,
  setOverride: (overrideBoardId, override) =>
    set({ overrideBoardId, override }),
  clear: () => set({ overrideBoardId: null, override: null }),
}));
