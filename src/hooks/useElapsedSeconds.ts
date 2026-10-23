import { useEffect, useState } from "react";

/** How often the elapsed time updates, in milliseconds */
const TICK_INTERVAL = 500;

/** Seconds elapsed since `startedAt` (a `performance.now()` timestamp) */
export default function useElapsedSeconds(startedAt: number) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const tick = () => setSeconds((performance.now() - startedAt) / 1000);
    const interval = window.setInterval(tick, TICK_INTERVAL);

    return () => window.clearInterval(interval);
  }, [startedAt]);

  return seconds;
}
