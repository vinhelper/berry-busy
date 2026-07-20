import { useOptimistic, useState, useTransition } from 'react';

export function useInlineRename(
  currentTitle: string,
  rename: (title: string) => Promise<unknown>
) {
  const [editing, setEditing] = useState(false);
  const [optimisticTitle, setOptimisticTitle] = useOptimistic(currentTitle);
  const [, startTransition] = useTransition();

  function submit(rawTitle: string | null | undefined) {
    const title = rawTitle?.trim();
    setEditing(false);
    if (!title || title === currentTitle) return;
    startTransition(async () => {
      setOptimisticTitle(title);
      await rename(title);
    });
  }

  return {
    editing,
    startEditing: () => setEditing(true),
    cancelEditing: () => setEditing(false),
    optimisticTitle,
    submit,
  };
}
