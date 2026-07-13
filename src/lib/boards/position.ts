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
