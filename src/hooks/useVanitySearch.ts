import * as Comlink from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";

import useSession from "./useSession";
import useSessionStore from "./useSessionStore";
import { JobStatus } from "../workers/protocol";
import { walletPool } from "../workers/walletPool";
import type { VanityMatcher } from "../lib/vanity";
import type { WalletRow } from "../types/wallet";

/** How often the shown number of tries updates, in milliseconds */
const STATS_INTERVAL = 500;

export interface VanityResult {
  status: JobStatus;
  attempts: number;
  row?: WalletRow;
  error?: unknown;
}

export interface VanityStats {
  attempts: number;
  startedAt: number;
}

/** The first error of a Promise.any rejection, or the error itself */
function firstError(error: unknown) {
  return error instanceof AggregateError ? error.errors[0] : error;
}

/**
 * Searches every worker for an address matching a pattern. Matches are added
 * to the list while it holds earlier matches, and replace it otherwise.
 */
export default function useVanitySearch(moduleId: string) {
  const store = useSessionStore();
  const setRows = useSession((state) => state.setRows);
  const [status, setStatus] = useState<JobStatus>(JobStatus.IDLE);
  const [stats, setStats] = useState<VanityStats>({
    attempts: 0,
    startedAt: 0,
  });
  const attemptsRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const ownRowsRef = useRef<WalletRow[] | null>(null);

  /** True when the list only holds matches from this search */
  const ownsRows = useCallback(
    () => store.getState().rows === ownRowsRef.current,
    [store],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const search = useCallback(
    async (matcher: VanityMatcher): Promise<VanityResult | null> => {
      /* One search at a time */
      if (abortRef.current) return null;

      const controller = new AbortController();
      abortRef.current = controller;
      attemptsRef.current = 0;

      setStatus(JobStatus.RUNNING);
      setStats({ attempts: 0, startedAt: performance.now() });

      const interval = window.setInterval(
        () => setStats((prev) => ({ ...prev, attempts: attemptsRef.current })),
        STATS_INTERVAL,
      );
      const workers = walletPool.acquire(Infinity);
      const onAttempts = Comlink.proxy((attempts: number) => {
        attemptsRef.current += attempts;
      });
      const aborted = new Promise<never>((_, reject) => {
        controller.signal.addEventListener("abort", reject, { once: true });
      });

      const result: VanityResult = { status: JobStatus.DONE, attempts: 0 };

      try {
        result.row = await Promise.race([
          Promise.any(
            workers.map((worker) =>
              worker.vanity({ moduleId, matcher }, onAttempts),
            ),
          ),
          aborted,
        ]);
      } catch (error) {
        result.status = controller.signal.aborted
          ? JobStatus.CANCELLED
          : JobStatus.FAILED;
        result.error = firstError(error);
      } finally {
        /* The other workers are still searching */
        walletPool.terminate();
        walletPool.release();
        window.clearInterval(interval);
        abortRef.current = null;
      }

      result.attempts = attemptsRef.current;
      setStats((prev) => ({ ...prev, attempts: result.attempts }));

      if (result.row) {
        const rows = ownsRows()
          ? [...store.getState().rows, result.row]
          : [result.row];

        ownRowsRef.current = rows;
        setRows(rows, true);
      }

      setStatus(result.status);
      return result;
    },
    [moduleId, store, setRows, ownsRows],
  );

  /* Leaving the page stops a running search */
  useEffect(() => () => abortRef.current?.abort(), []);

  return { status, stats, search, stop, ownsRows };
}
