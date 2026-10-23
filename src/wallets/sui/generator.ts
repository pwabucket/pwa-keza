import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import type { WalletDeriver } from "../../types/wallet";
import { DERIVATION_PATH_FIELD } from "../fields";
import { SuiWallet } from "./fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { presets } from "./presets";

/** Sui account of a phrase at a path, with the bech32 key wallets import */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const keypair = Ed25519Keypair.deriveKeypairFromSeed(seed, path);

  return {
    [SuiWallet.MNEMONIC]: mnemonic,
    [SuiWallet.ADDRESS]: keypair.toSuiAddress(),
    [SuiWallet.PRIVATE_KEY]: keypair.getSecretKey(),
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);
