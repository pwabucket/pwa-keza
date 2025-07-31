import { createWalletWorker } from "./createWalletWorker";
import { Wallet } from "ethers";

createWalletWorker(async () => {
  const wallet = Wallet.createRandom();
  return {
    ["Address"]: wallet.address,
    ["Public Key"]: wallet.publicKey,
    ["Private Key"]: wallet.privateKey,
    ["Phrase"]: wallet.mnemonic.phrase,
  };
});
