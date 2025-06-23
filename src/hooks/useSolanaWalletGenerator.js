import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";
import { useCallback } from "react";

export default function useSolanaWalletGenerator() {
  return useCallback(async () => {
    const key = Keypair.generate();

    return {
      ["Address"]: key.publicKey.toBase58(),
      ["Secret Key"]: Buffer.from(key.secretKey).toString("hex"),
    };
  }, []);
}
