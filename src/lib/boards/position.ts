/**
 * Ordering uses a `position` float (fractional indexing): new items are placed
 * by inserting a value between neighbours, so reordering never renumbers the
 * rest. See CLAUDE.md.
 */
const POSITION_STEP = 1000;

/** Position for a new item appended after the current last one. */
export function positionAtEnd(lastPosition: number | null | undefined) {
  return (lastPosition ?? 0) + POSITION_STEP;
}

export function positionBetween(
  prev: number | null | undefined,
  next: number | null | undefined
) {
  if (prev == null && next == null) return POSITION_STEP;
  if (prev == null) return next! / 2;
  if (next == null) return prev + POSITION_STEP;
  return (prev + next) / 2;
}
