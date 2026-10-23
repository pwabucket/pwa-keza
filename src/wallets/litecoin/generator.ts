import * as bip39 from "bip39";

import type { WalletResult } from "../../types/wallet";
import { AddressType, deriveUtxoAccount, getRootKey } from "../utxo/derive";
import { LITECOIN } from "../utxo/networks";
import { LitecoinWallet } from "./fields";

export type LitecoinWalletResult = WalletResult<typeof LitecoinWallet>;

/** Litecoin addresses of a mnemonic; the key pair is the Native SegWit one */
export async function deriveLitecoinWallet(
  mnemonic: string,
): Promise<LitecoinWalletResult> {
  const root = getRootKey(await bip39.mnemonicToSeed(mnemonic), LITECOIN);
  const account = (type: AddressType) =>
    deriveUtxoAccount(root, LITECOIN, type);
  const native = account(AddressType.NATIVE_SEGWIT);

  return {
    [LitecoinWallet.MNEMONIC]: mnemonic,
    [LitecoinWallet.NATIVE_ADDRESS]: native.address,
    [LitecoinWallet.NESTED_ADDRESS]: account(AddressType.NESTED_SEGWIT).address,
    [LitecoinWallet.LEGACY_ADDRESS]: account(AddressType.LEGACY).address,
    [LitecoinWallet.PUBLIC_KEY]: native.publicKey,
    [LitecoinWallet.PRIVATE_KEY]: native.wif,
  };
}

export default function generateLitecoinWallet() {
  return deriveLitecoinWallet(bip39.generateMnemonic());
}
