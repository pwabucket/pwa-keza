import * as bip39 from "bip39";

import type { WalletGeneratorOptions, WalletResult } from "../../types/wallet";
import { AddressType, deriveUtxoAccount, getRootKey } from "../utxo/derive";
import { BITCOIN, BITCOIN_TESTNET } from "../utxo/networks";
import { BitcoinWallet } from "./fields";

export type BitcoinWalletResult = WalletResult<typeof BitcoinWallet>;

/** Bitcoin addresses of a mnemonic; the key pair is the Taproot one */
export async function deriveBitcoinWallet(
  mnemonic: string,
  { testnet = false }: WalletGeneratorOptions = {},
): Promise<BitcoinWalletResult> {
  const chain = testnet ? BITCOIN_TESTNET : BITCOIN;
  const root = getRootKey(await bip39.mnemonicToSeed(mnemonic), chain);
  const account = (type: AddressType) => deriveUtxoAccount(root, chain, type);
  const taproot = account(AddressType.TAPROOT);

  return {
    [BitcoinWallet.MNEMONIC]: mnemonic,
    [BitcoinWallet.TAPROOT_ADDRESS]: taproot.address,
    [BitcoinWallet.NESTED_ADDRESS]: account(AddressType.NESTED_SEGWIT).address,
    [BitcoinWallet.NATIVE_ADDRESS]: account(AddressType.NATIVE_SEGWIT).address,
    [BitcoinWallet.LEGACY_ADDRESS]: account(AddressType.LEGACY).address,
    [BitcoinWallet.PUBLIC_KEY]: taproot.publicKey,
    [BitcoinWallet.PRIVATE_KEY]: taproot.wif,
  };
}

export default function generateBitcoinWallet(options: WalletGeneratorOptions) {
  return deriveBitcoinWallet(bip39.generateMnemonic(), options);
}
