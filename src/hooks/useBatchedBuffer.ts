import { useCallback, useEffect, useRef } from "react";

/**
 * How often buffered items are committed, in milliseconds. Each commit
 * copies the whole list, so committing less often keeps large jobs cheap.
 */
const COMMIT_INTERVAL = 200;

/**
 * Collects items pushed at any rate and hands the full list to `onCommit`
 * at most once per interval.
 */
export default function useBatchedBuffer<T>(onCommit: (items: T[]) => void) {
  const bufferRef = useRef<T[]>([]);
  const timerRef = useRef(0);

  const commit = useCallback(() => {
    timerRef.current = 0;
    onCommit(bufferRef.current.slice());
  }, [onCommit]);

  const push = useCallback(
    (chunk: T[]) => {
      bufferRef.current.push(...chunk);

      if (!timerRef.current) {
        timerRef.current = window.setTimeout(commit, COMMIT_INTERVAL);
      }
    },
    [commit],
  );

  /** Commits anything still waiting for the interval */
  const flush = useCallback(() => {
    window.clearTimeout(timerRef.current);
    commit();
  }, [commit]);

  /** Empties the buffer and commits the empty list */
  const reset = useCallback(() => {
    window.clearTimeout(timerRef.current);
    bufferRef.current = [];
    commit();
  }, [commit]);

  /** Number of items pushed so far, including uncommitted ones */
  const getSize = useCallback(() => bufferRef.current.length, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { push, flush, reset, getSize };
}
