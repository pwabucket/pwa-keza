import type { WalletDeriver } from "../../types/wallet";
import { AddressType, deriveUtxoAccount } from "../utxo/derive";
import { DERIVATION_PATH_FIELD } from "../fields";
import { DOGECOIN } from "../utxo/networks";
import { DogecoinWallet } from "./fields";
import { UTXO_PRESETS } from "../utxo/presets";
import { createBip39Generator } from "../derive";

/** Dogecoin legacy address of a phrase; its default path is m/44'/3'/0'/0/{i} */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const legacy = deriveUtxoAccount(
    seed,
    DOGECOIN,
    AddressType.LEGACY,
    pathTemplate,
    index,
  );

  return {
    [DogecoinWallet.MNEMONIC]: mnemonic,
    [DogecoinWallet.ADDRESS]: legacy.address,
    [DogecoinWallet.PUBLIC_KEY]: legacy.publicKey,
    [DogecoinWallet.PRIVATE_KEY]: legacy.wif,
    [DERIVATION_PATH_FIELD.label]: legacy.path,
  };
};

export default createBip39Generator(derive, UTXO_PRESETS[0].path);
