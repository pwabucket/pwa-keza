import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";

import type { WalletResult } from "../../types/wallet";
import { SolanaWallet } from "./fields";

export type SolanaWalletResult = WalletResult<typeof SolanaWallet>;
export type SolanaWalletGeneratorArguments = Parameters<
  typeof generateSolanaWallet
>;

export async function generateSolanaWallet(): Promise<SolanaWalletResult> {
  const key = await Keypair.generate();

  return {
    [SolanaWallet.ADDRESS]: key.publicKey.toBase58(),
    [SolanaWallet.SECRET_KEY]: Buffer.from(key.secretKey).toString("hex"),
  };
}

export default generateSolanaWallet;
