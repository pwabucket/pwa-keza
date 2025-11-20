import { Wallet } from "ethers";

import type { WalletResult } from "../types/wallet";

export const EVMWallet = {
  ADDRESS: "Address",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key",
  PHRASE: "Phrase",
} as const;

export type EVMWalletResult = WalletResult<typeof EVMWallet>;
export type EVMWalletGeneratorArguments = Parameters<typeof generateEVMWallet>;

export async function generateEVMWallet(): Promise<EVMWalletResult> {
  const wallet = Wallet.createRandom();
  return {
    [EVMWallet.ADDRESS]: wallet.address,
    [EVMWallet.PUBLIC_KEY]: wallet.publicKey,
    [EVMWallet.PRIVATE_KEY]: wallet.privateKey,
    [EVMWallet.PHRASE]: wallet.mnemonic?.phrase as string,
  };
}

export function getEVMParcelConfig(wallets: Record<string, string>[]) {
  return {
    group: "evm",
    recipients: wallets.map((w) => w[EVMWallet.ADDRESS]),
    senders: wallets.map((w) => ({
      address: w[EVMWallet.ADDRESS],
      privateKey: w[EVMWallet.PRIVATE_KEY],
    })),
  };
}
