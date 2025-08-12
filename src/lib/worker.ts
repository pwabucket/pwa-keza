import * as Comlink from "comlink";

export type WorkerAPI<
  Args extends unknown[],
  Result extends Record<string, string>
> = {
  generate: (...args: Args) => Promise<Result>;
  generateBatch: (count: number, ...args: Args) => Promise<Result[]>;
};

export const createWalletWorker = <
  Result extends Record<string, string>,
  Args extends unknown[] = []
>(
  generate: (...args: Args) => Promise<Result>
) => {
  const handler: WorkerAPI<Args, Result> = {
    async generate(...args: Args) {
      return generate(...args);
    },
    async generateBatch(count: number, ...args: Args) {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(await generate(...args));
      }

      return result;
    },
  };

  Comlink.expose(handler);
};
