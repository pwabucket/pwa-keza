import * as Comlink from "comlink";
import type { WalletGeneratorOptions, WorkerAPI } from "../types/wallet";

export const createWalletWorker = <Result extends Record<string, string>>(
  generate: (options: WalletGeneratorOptions) => Promise<Result>
) => {
  const handler: WorkerAPI<Result> = {
    async generate(options) {
      return generate(options);
    },
    async generateBatch(count, options) {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(await generate(options));
      }

      return result;
    },
  };

  Comlink.expose(handler);
};
