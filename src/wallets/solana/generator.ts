import * as bip39 from "bip39";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";

import type { WalletResult } from "../../types/wallet";
import { SolanaWallet } from "./fields";
import { deriveEd25519Seed } from "../slip10";

export type SolanaWalletResult = WalletResult<typeof SolanaWallet>;

/** Path used by Phantom, Solflare and Backpack for the first account */
const SOLANA_PATH = "m/44'/501'/0'/0'";

/** Solana wallet of a mnemonic, as Phantom derives its first account */
export async function deriveSolanaWallet(
  mnemonic: string,
): Promise<SolanaWalletResult> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const key = await Keypair.fromSeed(
    await deriveEd25519Seed(seed, SOLANA_PATH),
  );

  return {
    [SolanaWallet.MNEMONIC]: mnemonic,
    [SolanaWallet.ADDRESS]: key.publicKey.toBase58(),
    [SolanaWallet.PRIVATE_KEY]: bs58.encode(key.secretKey),
    [SolanaWallet.SECRET_KEY]: Buffer.from(key.secretKey).toString("hex"),
  };
}

export default function generateSolanaWallet() {
  return deriveSolanaWallet(bip39.generateMnemonic());
}
