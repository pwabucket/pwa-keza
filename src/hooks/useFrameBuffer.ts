import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Collects items pushed at any rate and commits them to state at most once
 * per animation frame.
 */
export default function useFrameBuffer<T>() {
  const [items, setItems] = useState<T[]>([]);
  const bufferRef = useRef<T[]>([]);
  const frameRef = useRef(0);

  const commit = useCallback(() => {
    frameRef.current = 0;
    setItems(bufferRef.current.slice());
  }, []);

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

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    bufferRef.current = [];
    setItems([]);
  }, []);

  /** Number of items pushed so far, including uncommitted ones */
  const getSize = useCallback(() => bufferRef.current.length, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return { items, push, flush, reset, getSize };
}
