import { Keypair } from "@stellar/stellar-sdk";

import type { WalletResult } from "../../types/wallet";
import { StellarWallet } from "./fields";

export type StellarWalletResult = WalletResult<typeof StellarWallet>;
export type StellarWalletGeneratorArguments = Parameters<
  typeof generateStellarWallet
>;

export async function generateStellarWallet(): Promise<StellarWalletResult> {
  const key = Keypair.random();

  return {
    [StellarWallet.ADDRESS]: key.publicKey(),
    [StellarWallet.SECRET_KEY]: key.secret(),
  };
}

export default generateStellarWallet;
