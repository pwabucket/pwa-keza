import * as Comlink from "comlink";
import { useCallback, useEffect, useRef } from "react";

export default function useWalletWorker(
  WorkerClass,
  poolSize = navigator.hardwareConcurrency || 4
) {
  const workersRef = useRef([]);

  useEffect(() => {
    const pool = [];

    for (let i = 0; i < poolSize; i++) {
      const worker = new WorkerClass();
      const api = Comlink.wrap(worker);
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

  const generateWallets = useCallback(async (count, ...args) => {
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
