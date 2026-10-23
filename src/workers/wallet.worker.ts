import "../lib/polyfill";

import * as Comlink from "comlink";

import type { WalletGenerator, WalletRow } from "../types/wallet";
import type { WalletWorkerAPI } from "./protocol";

/** Rows sent per chunk, unless the interval passes first */
const CHUNK_SIZE = 25;

/** Longest wait in milliseconds before sending the rows produced so far */
const CHUNK_INTERVAL = 100;

/** Each module's generator, loaded on first use into its own chunk */
const generators = import.meta.glob<WalletGenerator>(
  "../wallets/*/generator.ts",
  { import: "default" },
);

function loadGenerator(moduleId: string) {
  const load = generators[`../wallets/${moduleId}/generator.ts`];

  if (!load) {
    throw new Error(`Unknown wallet module: ${moduleId}`);
  }

  return load();
}

const api: WalletWorkerAPI = {
  async generate({ moduleId, count, options }, onChunk) {
    const generate = await loadGenerator(moduleId);
    let chunk: WalletRow[] = [];
    let lastSent = performance.now();

    for (let i = 0; i < count; i++) {
      chunk.push(await generate(options));

      const isFull = chunk.length >= CHUNK_SIZE;
      const isDue = performance.now() - lastSent >= CHUNK_INTERVAL;

      if (isFull || isDue) {
        /* Awaited so every chunk arrives before the job resolves */
        await onChunk(chunk);
        chunk = [];
        lastSent = performance.now();
      }
    }

    if (chunk.length > 0) {
      await onChunk(chunk);
    }
  },
};

Comlink.expose(api);
