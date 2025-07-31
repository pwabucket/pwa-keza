import "../lib/polyfill.js";

import { generateMnemonic } from "bip39";

import { createWalletWorker } from "./createWalletWorker";

createWalletWorker(async (strength) => {
  console.log(strength);
  let mnemonic = generateMnemonic(strength === 12 ? 128 : 256);

  return {
    ["Phrase"]: mnemonic,
  };
});
