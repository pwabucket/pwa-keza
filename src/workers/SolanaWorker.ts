import { createWalletWorker } from "./createWalletWorker";
import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";

createWalletWorker(async () => {
  const key = Keypair.generate();

  return {
    ["Address"]: key.publicKey.toBase58(),
    ["Secret Key"]: Buffer.from(key.secretKey).toString("hex"),
  };
});
