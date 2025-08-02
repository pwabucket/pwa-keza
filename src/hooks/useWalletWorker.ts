import * as Comlink from "comlink";
import { useCallback, useEffect, useRef } from "react";

export default function useWalletWorker(
  WorkerClass: new () => Worker,
  poolSize = navigator.hardwareConcurrency || 4
) {
  const workersRef = useRef<{ worker: Worker; api: any }[]>([]);

  useEffect(() => {
    const pool = [];

    for (let i = 0; i < poolSize; i++) {
      const worker = new WorkerClass();
      const api = Comlink.wrap<{
        generateBatch: (size: number, ...args: any[]) => Promise<any[]>;
      }>(worker);
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

  const generateWallets = useCallback(async (count: number, ...args: any[]) => {
    const pool = workersRef.current;
    if (pool.length === 0) return [];

    const batchSize = Math.floor(count / pool.length);
    const remainder = count % pool.length;

    const tasks = pool.map(({ api }, index) => {
      const size = batchSize + (index < remainder ? 1 : 0);
      return size > 0 ? api.generateBatch(size, ...args) : [];
    });

    const results = await Promise.all(tasks);
    return results.flat();
  }, []);

  return generateWallets;
}
