import { useCallback, useEffect, useRef } from "react";

/**
 * Collects items pushed at any rate and hands the full list to `onCommit`
 * at most once per animation frame.
 */
export default function useFrameBuffer<T>(onCommit: (items: T[]) => void) {
  const bufferRef = useRef<T[]>([]);
  const frameRef = useRef(0);

  const commit = useCallback(() => {
    frameRef.current = 0;
    onCommit(bufferRef.current.slice());
  }, [onCommit]);

  const push = useCallback(
    (chunk: T[]) => {
      bufferRef.current.push(...chunk);

      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(commit);
      }
    },
    [commit],
  );

  /** Commits anything still waiting for a frame */
  const flush = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    commit();
  }, [commit]);

  /** Empties the buffer and commits the empty list */
  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    bufferRef.current = [];
    commit();
  }, [commit]);

  /** Number of items pushed so far, including uncommitted ones */
  const getSize = useCallback(() => bufferRef.current.length, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return { push, flush, reset, getSize };
}
