import * as bip39 from "bip39";
import { Keypair } from "@stellar/stellar-sdk";

import type { WalletResult } from "../../types/wallet";
import { StellarWallet } from "./fields";
import { deriveEd25519Seed } from "../slip10";

export type StellarWalletResult = WalletResult<typeof StellarWallet>;

/** SEP-0005 path of the first account, used by Lobstr and Freighter */
const STELLAR_PATH = "m/44'/148'/0'";

/** Stellar wallet of a mnemonic, following SEP-0005 */
export async function deriveStellarWallet(
  mnemonic: string,
): Promise<StellarWalletResult> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const key = Keypair.fromRawEd25519Seed(
    await deriveEd25519Seed(seed, STELLAR_PATH),
  );

  return {
    [StellarWallet.MNEMONIC]: mnemonic,
    [StellarWallet.ADDRESS]: key.publicKey(),
    [StellarWallet.SECRET_KEY]: key.secret(),
  };
}

export default function generateStellarWallet() {
  return deriveStellarWallet(bip39.generateMnemonic());
}
