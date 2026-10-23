import * as bip39 from "bip39";
import { Ed25519PrivateKey } from "@aptos-labs/ts-sdk/crypto";

import type { WalletResult } from "../../types/wallet";
import { AptosWallet } from "./fields";

export type AptosWalletResult = WalletResult<typeof AptosWallet>;

/** First account path of Petra */
const APTOS_PATH = "m/44'/637'/0'/0'/0'";

/** Aptos account of a mnemonic, with the AIP-80 key wallets import */
export async function deriveAptosWallet(
  mnemonic: string,
): Promise<AptosWalletResult> {
  const privateKey = Ed25519PrivateKey.fromDerivationPath(APTOS_PATH, mnemonic);
  const publicKey = privateKey.publicKey();

  return {
    [AptosWallet.MNEMONIC]: mnemonic,
    [AptosWallet.ADDRESS]: publicKey.authKey().derivedAddress().toStringLong(),
    [AptosWallet.PUBLIC_KEY]: publicKey.toString(),
    [AptosWallet.PRIVATE_KEY]: privateKey.toAIP80String(),
  };
}

export default function generateAptosWallet() {
  return deriveAptosWallet(bip39.generateMnemonic());
}
