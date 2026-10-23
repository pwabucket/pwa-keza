import type { WalletDeriver } from "../../types/wallet";
import { AddressType, deriveUtxoAccount } from "../utxo/derive";
import { BITCOIN, BITCOIN_TESTNET } from "../utxo/networks";
import { BitcoinWallet } from "./fields";
import { DERIVATION_PATH_FIELD } from "../fields";
import { UTXO_PRESETS } from "../utxo/presets";
import { createBip39Generator, resolvePath } from "../derive";

/** Bitcoin addresses of a phrase; the key pair is the Taproot one */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
  testnet = false,
}) => {
  const chain = testnet ? BITCOIN_TESTNET : BITCOIN;
  const account = (type: AddressType) =>
    deriveUtxoAccount(seed, chain, type, pathTemplate, index);
  const taproot = account(AddressType.TAPROOT);

  return {
    [BitcoinWallet.MNEMONIC]: mnemonic,
    [BitcoinWallet.TAPROOT_ADDRESS]: taproot.address,
    [BitcoinWallet.NESTED_ADDRESS]: account(AddressType.NESTED_SEGWIT).address,
    [BitcoinWallet.NATIVE_ADDRESS]: account(AddressType.NATIVE_SEGWIT).address,
    [BitcoinWallet.LEGACY_ADDRESS]: account(AddressType.LEGACY).address,
    [BitcoinWallet.PUBLIC_KEY]: taproot.publicKey,
    [BitcoinWallet.PRIVATE_KEY]: taproot.wif,
    [DERIVATION_PATH_FIELD.label]: resolvePath(pathTemplate, {
      coin: chain.coinType,
      i: index,
    }),
  };
};

export default createBip39Generator(derive, UTXO_PRESETS[0].path);
