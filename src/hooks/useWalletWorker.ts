import * as Comlink from "comlink";
import { useCallback, useEffect, useRef } from "react";

import type {
  WalletGeneratorOptions,
  WorkerAPI,
  WorkerConstructor,
} from "../types/wallet";

export default function useWalletWorker<
  Generator extends (options: WalletGeneratorOptions) => Promise<Result>,
  Result extends Record<string, string> = Awaited<ReturnType<Generator>>
>(
  WorkerClass: WorkerConstructor | undefined,
  poolSize = navigator.hardwareConcurrency || 4
) {
  const workersRef = useRef<
    { worker: Worker; api: Comlink.Remote<WorkerAPI<Result>> }[]
  >([]);

  useEffect(() => {
    if (!WorkerClass) return;

    const pool = [];

    for (let i = 0; i < poolSize; i++) {
      const worker = new WorkerClass();
      const api = Comlink.wrap<WorkerAPI<Result>>(worker);

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
    async (count: number, options: WalletGeneratorOptions) => {
      const pool = workersRef.current;
      if (pool.length === 0) return [];

      const batchSize = Math.floor(count / pool.length);
      const remainder = count % pool.length;

      const tasks = pool.map(({ api }, index) => {
        const size = batchSize + (index < remainder ? 1 : 0);
        const result =
          size > 0 ? api.generateBatch(size, options) : Promise.resolve([]);
        return result;
      });

      const results = await Promise.all(tasks);
      return results.flat();
    },
    []
  );

  return generateWallets;
}
