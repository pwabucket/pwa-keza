import * as bip39 from "bip39";

import type { WalletResult } from "../../types/wallet";
import { AddressType, deriveUtxoAccount, getRootKey } from "../utxo/derive";
import { DOGECOIN } from "../utxo/networks";
import { DogecoinWallet } from "./fields";

export type DogecoinWalletResult = WalletResult<typeof DogecoinWallet>;

/** Dogecoin address of a mnemonic at m/44'/3'/0'/0/0 */
export async function deriveDogecoinWallet(
  mnemonic: string,
): Promise<DogecoinWalletResult> {
  const root = getRootKey(await bip39.mnemonicToSeed(mnemonic), DOGECOIN);
  const legacy = deriveUtxoAccount(root, DOGECOIN, AddressType.LEGACY);

  return {
    [DogecoinWallet.MNEMONIC]: mnemonic,
    [DogecoinWallet.ADDRESS]: legacy.address,
    [DogecoinWallet.PUBLIC_KEY]: legacy.publicKey,
    [DogecoinWallet.PRIVATE_KEY]: legacy.wif,
  };
}

export default function generateDogecoinWallet() {
  return deriveDogecoinWallet(bip39.generateMnemonic());
}
