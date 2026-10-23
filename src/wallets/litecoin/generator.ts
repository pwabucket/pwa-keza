import type { WalletDeriver } from "../../types/wallet";
import { AddressType, deriveUtxoAccount } from "../utxo/derive";
import { DERIVATION_PATH_FIELD } from "../fields";
import { LITECOIN } from "../utxo/networks";
import { LitecoinWallet } from "./fields";
import { UTXO_PRESETS } from "../utxo/presets";
import { createBip39Generator, resolvePath } from "../derive";

/** Litecoin addresses of a phrase; the key pair is the Native SegWit one */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const account = (type: AddressType) =>
    deriveUtxoAccount(seed, LITECOIN, type, pathTemplate, index);
  const native = account(AddressType.NATIVE_SEGWIT);

  return {
    [LitecoinWallet.MNEMONIC]: mnemonic,
    [LitecoinWallet.NATIVE_ADDRESS]: native.address,
    [LitecoinWallet.NESTED_ADDRESS]: account(AddressType.NESTED_SEGWIT).address,
    [LitecoinWallet.LEGACY_ADDRESS]: account(AddressType.LEGACY).address,
    [LitecoinWallet.PUBLIC_KEY]: native.publicKey,
    [LitecoinWallet.PRIVATE_KEY]: native.wif,
    [DERIVATION_PATH_FIELD.label]: resolvePath(pathTemplate, {
      coin: LITECOIN.coinType,
      i: index,
    }),
  };
};

export default createBip39Generator(derive, UTXO_PRESETS[0].path);
