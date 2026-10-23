import "../lib/polyfill";

import * as Comlink from "comlink";
import * as bip39 from "bip39";

import type {
  WalletDeriver,
  WalletGenerator,
  WalletRow,
} from "../types/wallet";
import type { ChunkHandler, WalletWorkerAPI } from "./protocol";
import { MnemonicType } from "../wallets/derive";

/** Rows sent per chunk, unless the interval passes first */
const CHUNK_SIZE = 25;

/** Longest wait in milliseconds before sending the rows produced so far */
const CHUNK_INTERVAL = 100;

/** Each module's generator and deriver, loaded on first use into its chunk */
const generators = import.meta.glob<WalletGenerator>(
  "../wallets/*/generator.ts",
  { import: "default" },
);
const derivers = import.meta.glob<WalletDeriver | undefined>(
  "../wallets/*/generator.ts",
  { import: "derive" },
);

async function loadExport<T>(
  modules: Record<string, () => Promise<T | undefined>>,
  moduleId: string,
): Promise<T> {
  const load = modules[`../wallets/${moduleId}/generator.ts`];
  const value = load ? await load() : undefined;

  if (!value) {
    throw new Error(`Unsupported wallet module: ${moduleId}`);
  }

  return value;
}

/** Produces rows one by one and sends them in chunks */
async function streamRows(
  count: number,
  produce: (offset: number) => Promise<WalletRow>,
  onChunk: ChunkHandler,
) {
  let chunk: WalletRow[] = [];
  let lastSent = performance.now();

  for (let offset = 0; offset < count; offset++) {
    chunk.push(await produce(offset));

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
}

/** Checks a phrase and returns the seed derivers use; empty for TON */
async function getSeed(
  mnemonic: string,
  passphrase: string,
  mnemonicType: MnemonicType,
) {
  if (mnemonicType === MnemonicType.TON) {
    const { mnemonicValidate } = await import("@ton/crypto");

    if (!(await mnemonicValidate(mnemonic.split(" ")))) {
      throw new Error("This isn't a valid TON recovery phrase.");
    }

    return new Uint8Array();
  }

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("This isn't a valid recovery phrase. Check every word.");
  }

  return bip39.mnemonicToSeed(mnemonic, passphrase);
}

const api: WalletWorkerAPI = {
  async generate({ moduleId, count, options }, onChunk) {
    const generate = await loadExport(generators, moduleId);

    await streamRows(count, () => generate(options), onChunk);
  },

  async derive(job, onChunk) {
    const derive = await loadExport(derivers, job.moduleId);
    const seed = await getSeed(job.mnemonic, job.passphrase, job.mnemonicType);

    await streamRows(
      job.count,
      (offset) =>
        derive({
          mnemonic: job.mnemonic,
          seed,
          index: job.start + offset,
          pathTemplate: job.pathTemplate,
          testnet: job.testnet,
        }),
      onChunk,
    );
  },
};

Comlink.expose(api);
