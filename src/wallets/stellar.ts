import { Keypair } from "@stellar/stellar-sdk";
import type { WalletResult } from "../types/wallet";

export const StellarWallet = {
  ADDRESS: "Address",
  SECRET_KEY: "Secret Key",
} as const;

export type StellarWalletResult = WalletResult<typeof StellarWallet>;
export type StellarWalletGeneratorArguments = Parameters<
  typeof generateStellarWallet
>;

export async function generateStellarWallet() {
  const key = Keypair.random();

  return {
    [StellarWallet.ADDRESS]: key.publicKey(),
    [StellarWallet.SECRET_KEY]: key.secret(),
  };
}
