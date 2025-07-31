import { Keypair } from "@stellar/stellar-sdk";

import { createWalletWorker } from "./createWalletWorker";

createWalletWorker(async () => {
  const key = Keypair.random();

  return {
    ["Address"]: key.publicKey(),
    ["Secret Key"]: key.secret(),
  };
});
