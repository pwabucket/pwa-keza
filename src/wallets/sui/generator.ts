import * as bip39 from "bip39";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import type { WalletResult } from "../../types/wallet";
import { SuiWallet } from "./fields";

export type SuiWalletResult = WalletResult<typeof SuiWallet>;

/** First account path of Sui Wallet and Slush */
const SUI_PATH = "m/44'/784'/0'/0'/0'";

/** Sui account of a mnemonic, with the bech32 key wallets import */
export async function deriveSuiWallet(
  mnemonic: string,
): Promise<SuiWalletResult> {
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic, SUI_PATH);

  return {
    [SuiWallet.MNEMONIC]: mnemonic,
    [SuiWallet.ADDRESS]: keypair.toSuiAddress(),
    [SuiWallet.PRIVATE_KEY]: keypair.getSecretKey(),
  };
}

export default function generateSuiWallet() {
  return deriveSuiWallet(bip39.generateMnemonic());
}
