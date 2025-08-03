import { generateMnemonic } from "bip39";

import type { WalletResult } from "../types/wallet";

export const MnemonicWallet = {
  PHRASE: "Mnemonic Phrase",
} as const;

export type MnemonicWalletResult = WalletResult<typeof MnemonicWallet>;
export type MnemonicWalletGeneratorArguments = Parameters<
  typeof generateMnemonicPhrase
>;

export async function generateMnemonicPhrase(
  strength: 12 | 24 = 12
): Promise<MnemonicWalletResult> {
  const mnemonic = generateMnemonic(strength === 12 ? 128 : 256);

  return {
    [MnemonicWallet.PHRASE]: mnemonic,
  };
}
