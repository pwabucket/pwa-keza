import * as Comlink from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";

import useBatchedBuffer from "./useBatchedBuffer";
import useSession from "./useSession";
import {
  type ChunkHandler,
  type DeriveJob,
  JobStatus,
  type WalletWorkerAPI,
} from "../workers/protocol";
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

interface JobPlan {
  total: number;
  workerCount: number;
  /** Generated rows are unsaved; rows derived from the user's phrase aren't */
  unsaved: boolean;
  createTasks: (
    workers: Comlink.Remote<WalletWorkerAPI>[],
    onChunk: ChunkHandler,
  ) => Promise<void>[];
}

/** Runs wallet jobs on the worker pool, streaming rows into the session */
export default function useWalletJob(moduleId: string) {
  const setRows = useSession((state) => state.setRows);
  const unsavedRef = useRef(true);
  const commitRows = useCallback(
    (rows: WalletRow[]) => setRows(rows, unsavedRef.current),
    [setRows],
  );
  const { push, flush, reset, getSize } = useBatchedBuffer(commitRows);
  const [status, setStatus] = useState<JobStatus>(JobStatus.IDLE);
  const [progress, setProgress] = useState<JobProgress>({
    total: 0,
    startedAt: 0,
  });
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  const run = useCallback(
    async ({ total, workerCount, unsaved, createTasks }: JobPlan) => {
      /* One job at a time */
      if (abortRef.current) return null;

      const controller = new AbortController();
      abortRef.current = controller;
      unsavedRef.current = unsaved;

      reset();
      setStatus(JobStatus.RUNNING);
      setProgress({ total, startedAt: performance.now() });

      const workers = walletPool.acquire(workerCount);
      const onChunk = Comlink.proxy((chunk: WalletRow[]) => {
        if (!controller.signal.aborted) push(chunk);
      });
      const aborted = new Promise<never>((_, reject) => {
        controller.signal.addEventListener("abort", reject, { once: true });
      });

      const result: JobResult = { status: JobStatus.DONE, count: 0 };

      try {
        await Promise.race([
          Promise.all(createTasks(workers, onChunk)),
          aborted,
        ]);
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
    [push, flush, reset, getSize],
  );

  /** New random wallets, spread across the pool */
  const generate = useCallback(
    (count: number, options: WalletGeneratorOptions) =>
      run({
        total: count,
        workerCount: Math.ceil(count / ROWS_PER_WORKER),
        unsaved: true,
        createTasks: (workers, onChunk) =>
          splitCount(count, workers.length).map((size, i) =>
            workers[i].generate({ moduleId, count: size, options }, onChunk),
          ),
      }),
    [moduleId, run],
  );

  /** Accounts of an existing phrase, on one worker so they stay in order */
  const derive = useCallback(
    (job: Omit<DeriveJob, "moduleId">) =>
      run({
        total: job.count,
        workerCount: 1,
        unsaved: false,
        createTasks: ([worker], onChunk) => [
          worker.derive({ ...job, moduleId }, onChunk),
        ],
      }),
    [moduleId, run],
  );

  /*
   * Leaving the page stops a running job. So does hiding it for the
   * back/forward cache, where the pool terminates its workers.
   */
  useEffect(() => {
    const abort = () => abortRef.current?.abort();

    window.addEventListener("pagehide", abort);
    return () => {
      window.removeEventListener("pagehide", abort);
      abort();
    };
  }, []);

  return { status, progress, generate, derive, cancel };
}
