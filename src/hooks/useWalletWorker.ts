import * as Comlink from "comlink";
import { useCallback, useEffect, useRef } from "react";

import type { WorkerAPI } from "../workers/createWalletWorker";

type WorkerConstructor = new () => Worker;

type ComlinkWorkerArgs<T extends unknown[]> = {
  [I in keyof T]: Comlink.UnproxyOrClone<T[I]>;
};

export default function useWalletWorker<
  Generator extends (...args: Args) => Promise<Result>,
  Args extends unknown[] = Parameters<Generator>,
  Result extends Record<string, string> = Awaited<ReturnType<Generator>>
>(
  WorkerClass: WorkerConstructor,
  poolSize = navigator.hardwareConcurrency || 4
) {
  const workersRef = useRef<
    { worker: Worker; api: Comlink.Remote<WorkerAPI<Args, Result>> }[]
  >([]);

  useEffect(() => {
    const pool = [];

    for (let i = 0; i < poolSize; i++) {
      const worker = new WorkerClass();
      const api = Comlink.wrap<WorkerAPI<Args, Result>>(worker);

      pool.push({ worker, api });
    }

    workersRef.current = pool;

    return () => {
      for (const { worker } of workersRef.current) {
        worker.terminate();
      }
      workersRef.current = [];
    };
  }, [WorkerClass, poolSize]);

  const generateWallets = useCallback(
    async (count: number, ...args: ComlinkWorkerArgs<Args>) => {
      const pool = workersRef.current;
      if (pool.length === 0) return [];

      const batchSize = Math.floor(count / pool.length);
      const remainder = count % pool.length;

      const tasks = pool.map(({ api }, index) => {
        const size = batchSize + (index < remainder ? 1 : 0);
        const result =
          size > 0 ? api.generateBatch(size, ...args) : Promise.resolve([]);
        return result;
      });

      const results = await Promise.all(tasks);
      return results.flat();
    },
    []
  );

  return generateWallets;
}
