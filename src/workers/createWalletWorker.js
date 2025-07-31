import * as Comlink from "comlink";

export const createWalletWorker = (generate) => {
  const handler = {
    async generate(args) {
      return generate(...args);
    },
    async generateBatch(count, ...args) {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(await generate(...args));
      }

      return result;
    },
  };

  Comlink.expose(handler);
};
