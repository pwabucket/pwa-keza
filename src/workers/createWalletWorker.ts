import * as Comlink from "comlink";

export const createWalletWorker = (
  generate: (...args: any[]) => Promise<any>
) => {
  const handler = {
    async generate(args: any[]) {
      return generate(...args);
    },
    async generateBatch(count: number, ...args: any[]) {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(await generate(...args));
      }

      return result;
    },
  };

  Comlink.expose(handler);
};
