import * as bip39 from "bip39";

import type { WalletDeriver } from "../types/wallet";

/** Derives one account the way the worker does, for tests */
export async function deriveAccount(
  derive: WalletDeriver,
  mnemonic: string,
  pathTemplate: string,
  {
    index = 0,
    passphrase = "",
    testnet = false,
  }: { index?: number; passphrase?: string; testnet?: boolean } = {},
) {
  return derive({
    mnemonic,
    seed: await bip39.mnemonicToSeed(mnemonic, passphrase),
    index,
    pathTemplate,
    testnet,
  });
}
