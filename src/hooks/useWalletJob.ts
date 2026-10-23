import * as Comlink from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";

import useFrameBuffer from "./useFrameBuffer";
import { JobStatus } from "../workers/protocol";
import { splitCount } from "../lib/count";
import { walletPool } from "../workers/walletPool";
import type { WalletGeneratorOptions, WalletRow } from "../types/wallet";

/** Each worker gets at least this many wallets before another is added */
const ROWS_PER_WORKER = 25;

export interface JobResult {
  status: JobStatus;
  count: number;
  error?: unknown;
}

export interface JobProgress {
  total: number;
  startedAt: number;
}

/** Generates wallets on the worker pool, streaming rows as they arrive */
export default function useWalletJob(moduleId: string) {
  const {
    items: rows,
    push,
    flush,
    reset,
    getSize,
  } = useFrameBuffer<WalletRow>();
  const [status, setStatus] = useState<JobStatus>(JobStatus.IDLE);
  const [progress, setProgress] = useState<JobProgress>({
    total: 0,
    startedAt: 0,
  });
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  const start = useCallback(
    async (count: number, options: WalletGeneratorOptions) => {
      /* One job at a time */
      if (abortRef.current) return null;

      const controller = new AbortController();
      abortRef.current = controller;

      reset();
      setStatus(JobStatus.RUNNING);
      setProgress({ total: count, startedAt: performance.now() });

      const workers = walletPool.acquire(Math.ceil(count / ROWS_PER_WORKER));
      const onChunk = Comlink.proxy((chunk: WalletRow[]) => {
        if (!controller.signal.aborted) push(chunk);
      });
      const tasks = splitCount(count, workers.length).map((size, i) =>
        workers[i].generate({ moduleId, count: size, options }, onChunk),
      );
      const aborted = new Promise<never>((_, reject) => {
        controller.signal.addEventListener("abort", reject, { once: true });
      });

      const result: JobResult = { status: JobStatus.DONE, count: 0 };

      try {
        await Promise.race([Promise.all(tasks), aborted]);
      } catch (error) {
        /* Terminating is the only way to stop a busy worker */
        walletPool.terminate();
        result.status = controller.signal.aborted
          ? JobStatus.CANCELLED
          : JobStatus.FAILED;
        result.error = error;
      } finally {
        walletPool.release();
        abortRef.current = null;
      }

      flush();
      setStatus(result.status);
      result.count = getSize();

      return result;
    },
    [moduleId, push, flush, reset, getSize],
  );

  /* Leaving the page stops a running job */
  useEffect(() => () => abortRef.current?.abort(), []);

  return { rows, status, progress, start, cancel };
}
