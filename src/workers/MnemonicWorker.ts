import "../lib/polyfill.ts";

import { generateMnemonic } from "bip39";

import { createWalletWorker } from "./createWalletWorker";

createWalletWorker(async (strength: number) => {
  const mnemonic = generateMnemonic(strength === 12 ? 128 : 256);

  return {
    ["Phrase"]: mnemonic,
  };
});
