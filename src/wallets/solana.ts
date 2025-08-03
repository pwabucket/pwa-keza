import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";

import type { WalletResult } from "../types/wallet";

export const SolanaWallet = {
  ADDRESS: "Address",
  SECRET_KEY: "Secret Key",
} as const;

export type SolanaWalletResult = WalletResult<typeof SolanaWallet>;
export type SolanaWalletGeneratorArguments = Parameters<
  typeof generateSolanaWallet
>;

export async function generateSolanaWallet() {
  const key = Keypair.generate();

  return {
    [SolanaWallet.ADDRESS]: key.publicKey.toBase58(),
    [SolanaWallet.SECRET_KEY]: Buffer.from(key.secretKey).toString("hex"),
  };
}
