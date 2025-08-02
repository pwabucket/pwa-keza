import * as Comlink from "comlink";

export const createWalletWorker = <
  T extends unknown[],
  R extends Record<string, string>
>(
  generate: (...args: T) => Promise<R>
) => {
  const handler = {
    async generate(args: T) {
      return generate(...args);
    },
    async generateBatch(count: number, ...args: T) {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(await generate(...args));
      }

      return result;
    },
  };

  Comlink.expose(handler);
};
