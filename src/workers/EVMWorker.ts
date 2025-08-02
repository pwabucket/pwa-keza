import { Wallet } from "ethers";

import { createWalletWorker } from "./createWalletWorker";

createWalletWorker(async () => {
  const wallet = Wallet.createRandom();
  return {
    ["Address"]: wallet.address,
    ["Public Key"]: wallet.publicKey,
    ["Private Key"]: wallet.privateKey,
    ["Phrase"]: wallet.mnemonic?.phrase as string,
  };
});
